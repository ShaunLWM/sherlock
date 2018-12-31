# Sherlock
> Find usernames across [social networks](https://github.com/sdushantha/sherlock/blob/master/sites.md) 

> A NodeJS port of [Sherlock](https://github.com/sdushantha/sherlock)

<p align="center">
<img src="https://raw.githubusercontent.com/ShaunLWM/sherlock/master/preview.PNG">
</a>
</p>

## Installation

```bash
# clone the repo
$ git clone https://github.com/ShaunLWM/sherlock

# change the working directory to sherlock
$ cd sherlock

# install the required modules
$ npm install
or
$ yarn install
```

## Usage

```bash
    Usage
        $ node index.js [--file] [--username] [--parallel]

    Options
        --file, -f  parse username from file (each name on a newline)
        --username, -u sherlock a single username
        --parallel, -p number of concurrent sites to check (default: 5)

    Examples
        $ node index.js --username natgeo
        $ node index.js --file "C:\usernames.txt"

    Note
        either "--file" or "--username" has to be used.
```

## License
MIT License

Copyright (c) 2018 Shaun