import { Base } from "./base";
import { TraceProtocol } from "./traceProtocol";
import { applyMixins } from "./utils";

class ZkTrace extends Base {}
interface ZkTrace extends TraceProtocol {}

applyMixins(ZkTrace, [TraceProtocol]);

export default ZkTrace;
