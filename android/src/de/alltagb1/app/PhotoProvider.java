package de.alltagb1.app;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;

import java.io.File;
import java.io.FileNotFoundException;

/**
 * A minimal file provider: hands the camera app a content:// address to save a photo into,
 * and lets the WebView read it back. Photos live in the app's cache and are cleared after a day.
 */
public class PhotoProvider extends ContentProvider {
    static final String AUTHORITY = "de.alltagb1.app.photos";

    static File dir(Context c) {
        File d = new File(c.getCacheDir(), "photos");
        if (!d.exists()) d.mkdirs();
        return d;
    }

    static Uri newPhotoUri(Context c) {
        File d = dir(c);
        File[] old = d.listFiles();
        long cutoff = System.currentTimeMillis() - 24L * 60 * 60 * 1000;
        if (old != null) for (File f : old) if (f.lastModified() < cutoff) f.delete();
        String name = "foto-" + System.currentTimeMillis() + ".jpg";
        return Uri.parse("content://" + AUTHORITY + "/" + name);
    }

    static boolean hasPhoto(Context c, Uri uri) {
        File f = fileFor(c, uri);
        return f != null && f.exists() && f.length() > 0;
    }

    static File fileFor(Context c, Uri uri) {
        String name = uri.getLastPathSegment();
        if (name == null || name.contains("/") || name.contains("..")) return null;
        return new File(dir(c), name);
    }

    @Override public boolean onCreate() { return true; }

    @Override
    public ParcelFileDescriptor openFile(Uri uri, String mode) throws FileNotFoundException {
        File f = fileFor(getContext(), uri);
        if (f == null) throw new FileNotFoundException(uri.toString());
        return ParcelFileDescriptor.open(f, ParcelFileDescriptor.parseMode(mode));
    }

    @Override
    public String getType(Uri uri) { return "image/jpeg"; }

    @Override
    public Cursor query(Uri uri, String[] projection, String selection, String[] args, String sort) {
        File f = fileFor(getContext(), uri);
        MatrixCursor c = new MatrixCursor(new String[]{OpenableColumns.DISPLAY_NAME, OpenableColumns.SIZE});
        if (f != null) c.addRow(new Object[]{f.getName(), f.length()});
        return c;
    }

    @Override public Uri insert(Uri uri, ContentValues values) { return null; }
    @Override public int delete(Uri uri, String selection, String[] args) { return 0; }
    @Override public int update(Uri uri, ContentValues values, String selection, String[] args) { return 0; }
}
