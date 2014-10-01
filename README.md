```
$ npm install
$ node index.js
... tars and untars example/ fine
$ node index.js bad
... EACCES on untar
```

`node index.js bad` uses a different syntax to create the fstream Reader
(passing `{ path: ..., type: 'Directory' }` as the argument to
`fstream.Reader` instead of just the path as a string. This results in
no entry for the top-level directory in the outputted tarball, so when
untarring, `fstream` creates the directory with the same permissions as
the first file in it (in this case, not writeable).

Note that the outputted tarball can always be untarred by gnu tar.