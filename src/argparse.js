import parseArgs from "minimist";

const parsePort = inputArgv => {
  const argv = parseArgs(inputArgv.slice(2));

  var port = 3000;
  if (argv.p) {
    port = parseInt(argv.p);
  } else if (argv.port) {
    port = parseInt(argv.port);
  }
  return port;
};

export { parsePort };
