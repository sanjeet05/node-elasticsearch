# Node Elasticsearch

## Prerequisites.
1. Install **nodejs** in your system globally (https://nodejs.org/en/)
2. Install **elasticsearch** in your system globally (https://www.elastic.co/downloads/elasticsearch)
3. Open the terminal/cmd on the root folder
3. Run the command: 

```bash
npm install
```

### Start/Stop elasticsearch services

```bash
1. sudo service elasticsearch start
2. sudo service elasticsearch restart
3. sudo service elasticsearch stop
```

### See the current running cluster and node

```bash
curl -X GET 'http://localhost:9200'
```

### Insert data to elasticsearch
1. Should be on root folder
2. Run this command: 

```bash
node main
```

### Execute a search query to elasticsearch
1. Should be on root folder
2. Run this command: 

```bash
node search
```

**Done!**