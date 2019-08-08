### How works this proxy server

It is possible to query several functionality using this proxy server, currently it support `routing`, `tiling`,`authentication` and `DB access` functionality. In the future can be changed, functionality and APIs.

To run the server one need to run `node index.js` command

#### Routing

ToDo: Add more

#### Tile

ToDo: Add more

#### Auth

ToDo: Add more

#### DB search

`search` - http://localhost:3003/search?id=1234qwer1&eta=123
It takes all query data as text and makes request base in that.
It doesn't support integer values, so if one tries to filter integer/float number it won't return anything. Additionally it supports regex functionality for (only) ID attributes.
E.g. http://localhost:3003/search?id=f5047539 will return all documents which Ids match to _f5047539_, like _id: "f5047539-c19e-4a4c-895a-1cce923a377d"_

Please set environment variables.
For development environment it sets values:

```
MONGOURL=mongodb://localhost:27017
DBNAME=routesDB
```

It required to set DB URL ( localhost or from aws ) and DB name.
In case there would be authentication added, that also should be set here.

Table/Collection name is hard coded insode of server, but this also could be changed if we have different collections for different purposes, and request will contain information form which collection it requires the specific data.

Todo: Add endpoint for suggestions list, where would be possible to filter by unique ID.
