import parseArgs from "minimist";

export default (inputArgv) => {
  const argv = parseArgs(inputArgv.slice(2));

  let port = 3000;
  if (argv.p) {
    port = parseInt(argv.p, 10);
  } else if (argv.port) {
    port = parseInt(argv.port, 10);
  }
  return port;
};
