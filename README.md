# simple-http-server-benchmark
This is a project that contains several implementions of a simple http server with the following features:

- GET /plain
It returns a JSON hello world
- GET /html-template
It renders a html using a template engine
- GET /sqlite/random-5fields/:size
It randomly returns a JSON list of objects with 5 fields each of them. The size determines how many items will be returned in the list. Those will be query from a sqlite database using primary key.
- GET /sqlite/random-30fields/:size
The same as above but return 30 fields for each object.

# Setup
The following steps were used to determine the benchmark results:

1. Create database with random data
```sh
bun install
bun createdb.ts
```
2. Build Docker image
3. Deploy sqlite database
3. Deploy docker image
4. Using local machine on a M4 PRO, run the benchmark using:

```sh
fortio load -c 100 -t 1m -qps -1 URL
```
URLs used:
- /plain
- /html-template
- /sqlite/random-5fields/1
- /sqlite/random-5fields/5
- /sqlite/random-5fields/10
- /sqlite/random-30fields/1
- /sqlite/random-30fields/5
- /sqlite/random-30fields/10
5. Repeat step 3 for each implementation

# Cloud server used
Contabo VPS Server 
- US East VPS 4 Cores
- 4 GB RAM
- 200 Mbit/s

# Results