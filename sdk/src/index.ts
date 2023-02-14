import { TraceProtocol } from "./traceProtocol";
import { applyMixins } from "./utils";

class ZkTrace extends TraceProtocol {}
interface ZkTrace {}

applyMixins(ZkTrace, [TraceProtocol]);

export default ZkTrace;
