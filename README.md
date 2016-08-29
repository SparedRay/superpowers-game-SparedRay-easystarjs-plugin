EasyStar JS API for Superpowers
===============================
### Initializing the map.
To start using EasyStar, you first have to define a grid and set which tile are supposed to be passable.

```Typescript

initFinder(Map : Sup.TileMap);
initFinder(Map : number[][]);
initFinder(Map?: any) {
  let PathFinder : EasyStar.js;
    
  // If Map is a TileMap we need to generate a number[][] based on it
	if(Map instanceof Sup.TileMap) {
		let tilemap : Sup.TileMap = Map;
		Map = [];
		
		for(let y = 0; y < tilemap.getHeight(); y++) {
		  Map[y] = []
		  for(let x = 0; x < tilemap.getWidth(); x++) {
		    // Here we first check what tile is at layer 0.
		    let tile = tilemap.getTileAt(0, x, y);
		    // I will use 0 as the floor and 1 as the walls
		    let tileInMap = 0;
		    // In this case Tiles.WallTiles is a number[] with the tile id's i have in my tileset for the walls
		    for(let wall of Tiles.WallTiles) {
		      if(tile === wall) tileInMap = 1;
		    }
		    Map[y][x] = tileInMap;
		  }
		}
	}
	// Just to be sure everything is ok.
	Sup.log(Map);

	PathFinder = new EasyStar.js();
	PathFinder.setGrid(Map);
	// Here is where a i say to EasyStar which tiles are ok to use.
	PathFinder.setAcceptableTiles([0]);
	
	return PathFinder;
}

```
in the example above we create a function where we can send a `number[][]` as the Map (which is the way EasyStar will needed) or we send the map as a TileMap and then create a `number[][]` map based on the tile types we found on each position of the tilemap.
### Finding the way through.
Now that we have defined how is the scenario mapped, we just need to use the `.findPath()` function provided by EasyStar.
```Typescript
findPath(pathFinder : EasyStar.js, init : Sup.Math.XY, end : Sup.Math.XY, callback? : Function) {
    // Here our path finder will look if there is a way to go from init(x, y) to end(x, y).
    pathFinder.findPath(init.x, init.y, end.x, end.y, 
      (path : EasyStar.Position[]) => {
        // EasyStar will return a null path if there is no posible way to go from init to end.
        if(path !== null) {
          if(path.length < 2) return;
          
          // Since .findPath() is an async function, it's better to use a callback instead of returning values.
          if(callback !== null) callback(path);
        } else {
          Sup.log('You can't get there');
        }
      }
    );
    
    // Even when we define the .findPath(), we still need to call .calculate() in order to start processing the path.
    pathFinder.calculate();
}
```
So that way our .findPath() function will use the callback when think it's ready to suggest a path. Also we need to know that path will be a `Sup.Math.XY[]` and it's first element will be the init(x,y) position (yes, the one we pass to the function).
### Wrapping everything.
Once we understand how our map will work, it can be used for moving an actor or whatever you want to do with the path using something like this.
```Typescript
/* Your normal code goes above this */
// Getting the map.
map = Sup.getActor('Map').tileMapRenderer.getTileMap();
// Define some init and end points.
init = {x: 0, y: 0};
end  = {x: 20, y: 20};

// Initialize the finder.
let pathFinder = this.initFinder(map);
// and now we find the path.
this.findPath(pathFinder, init, end, (path) => {
    /* Here we do whatever we want with the path, i will move the actor */
    this.moveActor(path);
});

moveActor(path : Sup.Math.XY[]) {
    let position = path.shift();
    this.actor.setPosition(position);
    
    Sup.setTimeout(250, () => {this.moveActor(path)});
}
```
And that's how you can use EasyStar API to move your tiles across the map.