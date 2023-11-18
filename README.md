# Blackbox

![Netlify](https://api.netlify.com/api/v1/badges/24ab316e-e4b2-4571-b324-46837fd5996a/deploy-status)
![Github Pages](https://github.com/P4SSER8Y/p4sser8y.github.io/actions/workflows/page.yml/badge.svg?branch=ocean)

## Setup

### Build Steps

```bash
# load environment variables
./scripts/deploy.sh
# output files are saved in ./dist
```

### Environment Variables

| Key                    | Default  | Description                      |
| ---------------------- | -------- | -------------------------------- |
| STREAM_PATH_PREFIX     | `stream` | prefix of stream                 |
| STREAM_MEDIA_BASE      | `/media` | prefix of media                  |
|                        |          |                                  |
| OS_STATIC_PATH         | `./dist` |                                  |
| OS_CORS_DOMAIN_PATTERN | `.*`     |                                  |
| OS_DATA_PATH_BASE      | `./data` |                                  |
|                        |          |                                  |
| DATA_REPO              | ` `      | git URL of data repo             |
| DATA_REPO_BRANCH       | ` `      | branch of data repo              |
|                        |          |                                  |
| INFO_NOW               | ` `      | UTC timestamp of build time      |
| GATE_LOCATION          | ` `      | location for authentication gate |
