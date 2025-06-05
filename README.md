# simple-http-server-benchmark
This is a project that contains several implementions of a simple http server with the following features:

- GET /plain
It returns a JSON hello world
- GET /html-template
It renders a html using a template engine
- GET /sqlite/random-5fields/:size
It randomly returns a JSON list of objects with 5 fields each of them. The size determines how many items will be returned in the list. Those will be query from a sqlite database using primary key. It uses person5 table
- GET /sqlite/random-30fields/:size
The same as above but return 30 fields for each object. It uses person30 table

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

## Env var
- PORT: to change the default port 3000
- DB_FILE: to change the default database file "data.db"

# Cloud server used
Contabo VPS Server 
- US East VPS 4 Cores
- 4 GB RAM
- 200 Mbit/s

# Results

```csv
Name,Endpoint,Requests,Error Count,AvgMs,QPS
node-raw,/plain,37339,0,161,622
node-raw,/html-template,35326,0,170,586
node-raw,/sqlite/random-5fields/1,29851,0,201,495
node-raw,/sqlite/random-5fields/5,31396,0,191,522
node-raw,/sqlite/random-5fields/10,33162,0,181,551
node-raw,/sqlite/random-30fields/1,33005,1,182,545
node-raw,/sqlite/random-30fields/5,32921,0,182,547
node-raw,/sqlite/random-30fields/10,28712,0,209,478
node-express-bettersqlite,/plain,33444,0,180,556
node-express-bettersqlite,/html-template,29642,0,203,491
node-express-bettersqlite,/sqlite/random-5fields/1,30307,0,198,504
node-express-bettersqlite,/sqlite/random-5fields/5,31528,0,191,524
node-express-bettersqlite,/sqlite/random-5fields/10,28514,0,212,472
node-express-bettersqlite,/sqlite/random-30fields/1,27187,0,221,452
node-express-bettersqlite,/sqlite/random-30fields/5,24832,0,242,412
node-express-bettersqlite,/sqlite/random-30fields/10,26127,0,230,434
node-fastify-bettersqlite,/plain,41542,0,145,691
node-fastify-bettersqlite,/html-template,35528,0,169,591
node-fastify-bettersqlite,/sqlite/random-5fields/1,42440,0,141,706
node-fastify-bettersqlite,/sqlite/random-5fields/5,30726,0,196,511
node-fastify-bettersqlite,/sqlite/random-5fields/10,35255,0,170,584
node-fastify-bettersqlite,/sqlite/random-30fields/1,25396,0,237,422
node-fastify-bettersqlite,/sqlite/random-30fields/5,29845,0,201,494
node-fastify-bettersqlite,/sqlite/random-30fields/10,26898,0,224,446
node-hono-bettersqlite,/plain,32956,0,183,546
node-hono-bettersqlite,/html-template,31670,0,190,526
node-hono-bettersqlite,/sqlite/random-5fields/1,30226,0,199,501
node-hono-bettersqlite,/sqlite/random-5fields/5,28412,0,212,471
node-hono-bettersqlite,/sqlite/random-5fields/10,29264,0,205,487
node-hono-bettersqlite,/sqlite/random-30fields/1,27187,0,221,450
node-hono-bettersqlite,/sqlite/random-30fields/5,24623,0,244,407
node-hono-bettersqlite,/sqlite/random-30fields/10,29298,0,205,485
bun-elysiajs,/plain,35094,0,171,583
bun-elysiajs,/html-template,33356,0,180,555
bun-elysiajs,/sqlite/random-5fields/1,30411,0,197,506
bun-elysiajs,/sqlite/random-5fields/5,34284,0,175,571
bun-elysiajs,/sqlite/random-5fields/10,34129,0,176,564
bun-elysiajs,/sqlite/random-30fields/1,34461,0,174,570
bun-elysiajs,/sqlite/random-30fields/5,37638,0,160,626
bun-elysiajs,/sqlite/random-30fields/10,29199,0,206,485
bun-hono,/plain,42864,0,140,713
bun-hono,/html-template,42252,0,142,701
bun-hono,/sqlite/random-5fields/1,40544,0,148,675
bun-hono,/sqlite/random-5fields/5,33623,3,180,536
bun-hono,/sqlite/random-5fields/10,37403,0,161,622
bun-hono,/sqlite/random-30fields/1,34642,0,173,576
bun-hono,/sqlite/random-30fields/5,31096,0,193,517
bun-hono,/sqlite/random-30fields/10,36521,0,164,608
bun-raw,/plain,38386,0,156,638
bun-raw,/html-template,38386,0,156,638
bun-raw,/sqlite/random-5fields/1,34258,0,175,567
bun-raw,/sqlite/random-5fields/5,34995,0,172,582
bun-raw,/sqlite/random-5fields/10,33695,0,178,561
bun-raw,/sqlite/random-30fields/1,27908,0,215,464
bun-raw,/sqlite/random-30fields/5,28313,0,212,471
bun-raw,/sqlite/random-30fields/10,26824,0,224,444
java-quarkus,/plain,34759,0,173,573
java-quarkus,/html-template,35276,0,170,583
java-quarkus,/sqlite/random-5fields/1,18213,0,332,300
java-quarkus,/sqlite/random-5fields/5,16116,0,373,266
java-quarkus,/sqlite/random-5fields/10,21615,0,278,359
java-quarkus,/sqlite/random-30fields/1,38526,0,156,641
java-quarkus,/sqlite/random-30fields/5,30446,0,197,505
java-quarkus,/sqlite/random-30fields/10,23432,0,257,389
java-quarkus-v2,/plain,26397,0,227,439
java-quarkus-v2,/html-template,26377,0,228,438
java-quarkus-v2,/sqlite/random-5fields/1,24461,0,246,406
java-quarkus-v2,/sqlite/random-5fields/5,31765,0,189,526
java-quarkus-v2,/sqlite/random-5fields/10,43725,0,137,728
java-quarkus-v2,/sqlite/random-30fields/1,39976,0,150,664
java-quarkus-v2,/sqlite/random-30fields/5,38232,0,157,636
java-quarkus-v2,/sqlite/random-30fields/10,29792,0,202,496
node-remix-bettersqlite,/plain,26123,0,230,434
node-remix-bettersqlite,/html-template,25434,0,237,422
node-remix-bettersqlite,/sqlite/random-5fields/1,25392,0,237,421
node-remix-bettersqlite,/sqlite/random-5fields/5,22124,0,271,368
node-remix-bettersqlite,/sqlite/random-5fields/10,18592,0,325,307
node-remix-bettersqlite,/sqlite/random-30fields/1,13401,0,450,222
node-remix-bettersqlite,/sqlite/random-30fields/5,27247,0,220,453
node-remix-bettersqlite,/sqlite/random-30fields/10,29958,0,201,489
```

Notes:
- java-quarkus-v2: it has a optimization to re-use database connection.
- java-quarkus: first implementation. 