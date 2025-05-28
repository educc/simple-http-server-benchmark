package org.example;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.inject.Inject;
import io.quarkus.qute.Template;
import io.quarkus.qute.TemplateInstance;
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
        return Map.of("message", "Hello, World!");
    }

    @GET
    @Path("html-template")
    @Produces(MediaType.TEXT_HTML)
    public TemplateInstance htmlTemplate() {
        return hello.data("message", "Hello, World!");
    }

    @GET
    @Path("sqlite/random-5fields/{size}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Map<String, Object>> random5(@PathParam("size") int size) throws SQLException {
        return getRandomRows("person5", 5, size);
    }

    @GET
    @Path("sqlite/random-30fields/{size}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Map<String, Object>> random30(@PathParam("size") int size) throws SQLException {
        return getRandomRows("person30", 30, size);
    }

    private List<Map<String, Object>> getRandomRows(String table, int fieldCount, int size) throws SQLException {
        String dbFile = System.getenv("DB_FILE");
        if (dbFile == null || dbFile.isBlank()) throw new IllegalStateException("DB_FILE env var not set");
        String url = "jdbc:sqlite:" + dbFile;
        try (Connection conn = DriverManager.getConnection(url)) {
            List<Integer> ids = new ArrayList<>();
            try (Statement st = conn.createStatement(); ResultSet rs = st.executeQuery("SELECT id FROM " + table)) {
                while (rs.next()) ids.add(rs.getInt(1));
            }
            Collections.shuffle(ids);
            List<Map<String, Object>> result = new ArrayList<>();
            for (int i = 0; i < Math.min(size, ids.size()); i++) {
                int id = ids.get(i);
                try (PreparedStatement ps = conn.prepareStatement("SELECT * FROM " + table + " WHERE id = ?")) {
                    ps.setInt(1, id);
                    try (ResultSet rs = ps.executeQuery()) {
                        if (rs.next()) {
                            Map<String, Object> row = new LinkedHashMap<>();
                            for (int j = 1; j <= fieldCount; j++) {
                                row.put("field" + j, rs.getObject(j));
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
