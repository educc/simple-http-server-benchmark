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

    private List<Map<String, Object>> getRandomRows(String table, int size) throws SQLException {
        String dbFile = System.getenv("DB_FILE");
        if (dbFile == null || dbFile.isBlank()) throw new IllegalStateException("DB_FILE env var not set");
        String url = "jdbc:sqlite:" + dbFile;
        try (Connection conn = DriverManager.getConnection(url)) {
            List<Map<String, Object>> result = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                int id = (int) (Math.random() * 100_000) + 1;
                try (PreparedStatement ps = conn.prepareStatement("SELECT * FROM " + table + " WHERE id = ?")) {
                    ps.setInt(1, id);
                    try (ResultSet rs = ps.executeQuery()) {
                        if (rs.next()) {
                            Map<String, Object> row = new LinkedHashMap<>();
                            ResultSetMetaData meta = rs.getMetaData();
                            int columnCount = meta.getColumnCount();
                            for (int j = 1; j <= columnCount; j++) {
                                String colName = meta.getColumnName(j);
                                row.put(colName, rs.getObject(j));
                            }
                            result.add(row);
                        }
                    }
                }
            }
            return result;
        }
    }
}
