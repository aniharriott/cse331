package campuspaths;

import campuspaths.utils.CORSFilter;
import pathfinder.ModelConnector;
import spark.*;
import pathfinder.datastructures.*;
import com.google.gson.Gson;

/**
 * This class represents a server for retrieving information about a certain graph.
 */
public class SparkServer {

  // Not an ADT

  // Creates routes to retrieve path information and data from a created graph.
  public static void main(String[] args) {
    CORSFilter corsFilter = new CORSFilter();
    corsFilter.apply();
    // The above two lines help set up some settings that allow the
    // React application to make requests to the Spark server, even though it
    // comes from a different server.
    // You should leave these two lines at the very beginning of main().
    ModelConnector connector = new ModelConnector();
    Gson gson = new Gson();
    // get a path between two given keywords
    Spark.get("/findPath/:start/:end", new Route() {
      @Override
      public Object handle(Request req, Response res) throws Exception{
        String start = req.params(":start");
        String end = req.params(":end");
        Path<Point> path = connector.findShortestPath(start, end);
        return gson.toJson(path);
      }
    });

  }
}