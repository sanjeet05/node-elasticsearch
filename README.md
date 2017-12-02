# node-elasticsearch

## Prerequisites.
1. install the **nodejs** in your system globally (https://nodejs.org/en/)
2. open the terminal/cmd on the root folder
3. run the command: 

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
1. should be on root folder
2. run this command: 

```bash
node main
```

3. output can see to the terminal

### Search a query to elasticsearch
1. should be on root folder
2. run this command: 

```bash
node search
```

3. output can see to the terminal