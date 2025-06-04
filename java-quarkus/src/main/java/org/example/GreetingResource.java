package org.example;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.inject.Inject;
import io.quarkus.qute.Template;
import jakarta.ws.rs.PathParam;
import java.sql.*;
import java.util.*;
import io.quarkus.runtime.ShutdownEvent;
import jakarta.enterprise.event.Observes;

@Path("/")
public class GreetingResource {
    @Inject
    Template hello;

    @GET
    @Path("plain")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, String> plain() {
        return Map.of("message", "Hello, world!");
    }

    @GET
    @Path("html-template")
    @Produces(MediaType.TEXT_HTML)
    public String htmlTemplate() {
        return hello.data("message", "Ben").render();
    }

    @GET
    @Path("sqlite/random-5fields/{size}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Map<String, Object>> random5(@PathParam("size") int size) throws SQLException {
        return getRandomRows("person5", size);
    }

    @GET
    @Path("sqlite/random-30fields/{size}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Map<String, Object>> random30(@PathParam("size") int size) throws SQLException {
        return getRandomRows("person30", size);
    }
    
    // Close database connection on application shutdown
    void onShutdown(@Observes ShutdownEvent event) {
        try {
            if (dbConnection != null && !dbConnection.isClosed()) {
                dbConnection.close();
            }
        } catch (SQLException e) {
            // Log the exception if needed
            e.printStackTrace();
        }
    }

    // Database connection as a singleton
private static Connection dbConnection;
private static final Object connectionLock = new Object();

// Get or initialize the database connection
private Connection getConnection() throws SQLException {
    if (dbConnection == null || dbConnection.isClosed()) {
        synchronized (connectionLock) {
            if (dbConnection == null || dbConnection.isClosed()) {
                String dbFile = System.getenv("DB_FILE");
                if (dbFile == null || dbFile.isBlank()) throw new IllegalStateException("DB_FILE env var not set");
                String url = "jdbc:sqlite:" + dbFile;
                dbConnection = DriverManager.getConnection(url);
                // Enable WAL mode for better concurrency
                try (Statement stmt = dbConnection.createStatement()) {
                    stmt.execute("PRAGMA journal_mode=WAL;");
                }
            }
        }
    }
    return dbConnection;
}

private List<Map<String, Object>> getRandomRows(String table, int size) throws SQLException {
    if (size <= 0) return Collections.emptyList();
    
    Connection conn = getConnection();
    List<Map<String, Object>> result = new ArrayList<>(size);
    
    // Prepare the statement outside the loop to reuse it
    String sql = "SELECT * FROM " + table + " WHERE id = ?";
    
    try (PreparedStatement ps = conn.prepareStatement(sql)) {
        // Get metadata once outside the loop
        int maxId = 100_000;
        ResultSetMetaData metaData = null;
        String[] columnNames = null;
        
        for (int i = 0; i < size; i++) {
            int id = (int) (Math.random() * maxId) + 1;
            ps.setInt(1, id);
            
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    // Initialize column names array on first result
                    if (metaData == null) {
                        metaData = rs.getMetaData();
                        int columnCount = metaData.getColumnCount();
                        columnNames = new String[columnCount];
                        for (int j = 1; j <= columnCount; j++) {
                            columnNames[j-1] = metaData.getColumnName(j);
                        }
                    }
                    
                    // Use the cached column names
                    int columnCount = columnNames.length;
                    Map<String, Object> row = new LinkedHashMap<>(columnCount);
                    for (int j = 1; j <= columnCount; j++) {
                        row.put(columnNames[j-1], rs.getObject(j));
                    }
                    result.add(row);
                }
            }
        }
    }
    
    return result;
}
}
