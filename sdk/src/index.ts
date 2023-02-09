import { Base } from "./base";
import { Storage } from "./storage";
import { applyMixins } from "./utils";

class ZkTrace extends Base {}
interface ZkTrace extends Storage {}

applyMixins(ZkTrace, [Storage]);

export default ZkTrace;
