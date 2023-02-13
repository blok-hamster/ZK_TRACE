import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { initialize } from "zokrates-js";

const from = "../circuit";
const to = "../server/circuit/preImage.zok";

const fileSystemResolver = () => {
  const location = resolve(dirname(resolve(from)), to);
  const source = readFileSync(location).toString();
  return source;
};

const getZokrateProvider = async () => {
  const zokratesProvider = await initialize();
  return zokratesProvider;
};

const getArtifacts = async () => {
  const source = fileSystemResolver();
  const zokratesProvider = await getZokrateProvider();
  const artifacts = zokratesProvider.compile(source);
  return artifacts;
};

const getWitness = async (params) => {
  try {
    const zokratesProvider = await getZokrateProvider();
    const artifacts = await getArtifacts();

    /**
     * @params is always an array of strings
     */
    // @ts-ignore
    const { output } = zokratesProvider.computeWitness(artifacts, params);

    console.log(output);
    return output;
  } catch (error) {
    console.log(error);
  }
};

getWitness(["0", "0", "0", "5"]);
