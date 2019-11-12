## stampede-portal

The Web UI for the stampede automation system.

### Install

```
npm install -g stampede-portal
```

### Config

The contents of the config file are in this format:

config param=config value

The configuration parameters are:

| Config        | Default   | Description                           |
| ------------- | --------- | ------------------------------------- |
| redisHost     | localhost | The host name for redis               |
| redisPort     | 6379      | The port for redis                    |
| redisPassword | null      | The password for redis if needed      |
| webPort       | 7744      | The web port used for the http server |
| dbHost        | localhost | Name of the postgres database host    |

### License
