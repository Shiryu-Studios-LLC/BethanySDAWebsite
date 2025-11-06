var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../../../../opt/homebrew/Cellar/cloudflare-wrangler/4.45.4/libexec/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../../../../../opt/homebrew/Cellar/cloudflare-wrangler/4.45.4/libexec/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../../../../../opt/homebrew/Cellar/cloudflare-wrangler/4.45.4/libexec/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../../../../opt/homebrew/Cellar/cloudflare-wrangler/4.45.4/libexec/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../../../../../opt/homebrew/Cellar/cloudflare-wrangler/4.45.4/libexec/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../../../../../opt/homebrew/Cellar/cloudflare-wrangler/4.45.4/libexec/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../../../../../opt/homebrew/Cellar/cloudflare-wrangler/4.45.4/libexec/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../../../../../opt/homebrew/Cellar/cloudflare-wrangler/4.45.4/libexec/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../../../../opt/homebrew/Cellar/cloudflare-wrangler/4.45.4/libexec/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../../../../../opt/homebrew/Cellar/cloudflare-wrangler/4.45.4/libexec/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../../../../../opt/homebrew/Cellar/cloudflare-wrangler/4.45.4/libexec/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../../../../../opt/homebrew/Cellar/cloudflare-wrangler/4.45.4/libexec/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../../../../../opt/homebrew/Cellar/cloudflare-wrangler/4.45.4/libexec/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../../../../../opt/homebrew/Cellar/cloudflare-wrangler/4.45.4/libexec/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../../../../../opt/homebrew/Cellar/cloudflare-wrangler/4.45.4/libexec/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var isWorkerdProcessV2 = globalThis.Cloudflare.compatibilityFlags.enable_nodejs_process_v2;
var unenvProcess = new Process({
  env: globalProcess.env,
  // `hrtime` is only available from workerd process v2
  hrtime: isWorkerdProcessV2 ? workerdProcess.hrtime : hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  // Always implemented by workerd
  env,
  // Only implemented in workerd v2
  hrtime: hrtime3,
  // Always implemented by workerd
  nextTick
} = unenvProcess;
var {
  _channel,
  _disconnect,
  _events,
  _eventsCount,
  _handleQueue,
  _maxListeners,
  _pendingMessage,
  _send,
  assert: assert2,
  disconnect,
  mainModule
} = unenvProcess;
var {
  // @ts-expect-error `_debugEnd` is missing typings
  _debugEnd,
  // @ts-expect-error `_debugProcess` is missing typings
  _debugProcess,
  // @ts-expect-error `_exiting` is missing typings
  _exiting,
  // @ts-expect-error `_fatalException` is missing typings
  _fatalException,
  // @ts-expect-error `_getActiveHandles` is missing typings
  _getActiveHandles,
  // @ts-expect-error `_getActiveRequests` is missing typings
  _getActiveRequests,
  // @ts-expect-error `_kill` is missing typings
  _kill,
  // @ts-expect-error `_linkedBinding` is missing typings
  _linkedBinding,
  // @ts-expect-error `_preload_modules` is missing typings
  _preload_modules,
  // @ts-expect-error `_rawDebug` is missing typings
  _rawDebug,
  // @ts-expect-error `_startProfilerIdleNotifier` is missing typings
  _startProfilerIdleNotifier,
  // @ts-expect-error `_stopProfilerIdleNotifier` is missing typings
  _stopProfilerIdleNotifier,
  // @ts-expect-error `_tickCallback` is missing typings
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  availableMemory,
  // @ts-expect-error `binding` is missing typings
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  // @ts-expect-error `domain` is missing typings
  domain,
  emit,
  emitWarning,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  // @ts-expect-error `initgroups` is missing typings
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  memoryUsage,
  // @ts-expect-error `moduleLoadList` is missing typings
  moduleLoadList,
  off,
  on,
  once,
  // @ts-expect-error `openStdin` is missing typings
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  // @ts-expect-error `reallyExit` is missing typings
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = isWorkerdProcessV2 ? workerdProcess : unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../../../../../opt/homebrew/Cellar/cloudflare-wrangler/4.45.4/libexec/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// api/pages/[[path]].js
function isLocalDevelopment(request) {
  const url = new URL(request.url);
  return url.hostname === "localhost" || url.hostname === "127.0.0.1";
}
__name(isLocalDevelopment, "isLocalDevelopment");
function verifyAuthentication(request) {
  if (isLocalDevelopment(request)) {
    return true;
  }
  const cookies = request.headers.get("Cookie") || "";
  const cfAccessToken = cookies.split(";").find((c) => c.trim().startsWith("CF_Authorization="));
  if (!cfAccessToken) {
    return false;
  }
  return true;
}
__name(verifyAuthentication, "verifyAuthentication");
async function onRequest(context2) {
  const { request, env: env2, params } = context2;
  const url = new URL(request.url);
  const path = params.path ? params.path.join("/") : "";
  const allowedOrigin = isLocalDevelopment(request) ? "http://localhost:5173" : url.origin;
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    if (request.method === "GET" && !path) {
      return await listPages(request, env2, corsHeaders);
    }
    if (request.method === "GET" && path) {
      return await getPageBySlug(request, env2, corsHeaders, path);
    }
    if (request.method === "POST" && !path) {
      return await createPage(request, env2, corsHeaders);
    }
    if (request.method === "PUT" && path) {
      return await updatePage(request, env2, corsHeaders, path);
    }
    if (request.method === "DELETE" && path) {
      return await deletePage(request, env2, corsHeaders, path);
    }
    return jsonResponse({ error: "Not found" }, 404, corsHeaders);
  } catch (error3) {
    console.error("API Error:", error3);
    return jsonResponse({ error: error3.message }, 500, corsHeaders);
  }
}
__name(onRequest, "onRequest");
async function listPages(request, env2, corsHeaders) {
  const { results } = await env2.DB.prepare(`
    SELECT id, slug, title, meta_description, is_published, show_in_nav, nav_order, created_at, updated_at
    FROM pages
    ORDER BY nav_order ASC, title ASC
  `).all();
  return jsonResponse({ pages: results }, 200, corsHeaders);
}
__name(listPages, "listPages");
async function getPageBySlug(request, env2, corsHeaders, slug) {
  const { results } = await env2.DB.prepare(`
    SELECT * FROM pages WHERE slug = ?
  `).bind(slug).all();
  if (results.length === 0) {
    return jsonResponse({ error: "Page not found" }, 404, corsHeaders);
  }
  return jsonResponse(results[0], 200, corsHeaders);
}
__name(getPageBySlug, "getPageBySlug");
async function createPage(request, env2, corsHeaders) {
  if (!verifyAuthentication(request)) {
    return jsonResponse({ error: "Unauthorized" }, 401, corsHeaders);
  }
  const page = await request.json();
  if (!page.title || typeof page.title !== "string") {
    return jsonResponse({ error: "Invalid input: title is required" }, 400, corsHeaders);
  }
  const slug = page.slug || page.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const { results: existing } = await env2.DB.prepare(
    "SELECT id FROM pages WHERE slug = ?"
  ).bind(slug).all();
  if (existing.length > 0) {
    return jsonResponse({ error: "A page with this slug already exists" }, 400, corsHeaders);
  }
  const result = await env2.DB.prepare(`
    INSERT INTO pages (slug, title, content, meta_description, is_published, show_in_nav, nav_order, show_page_header)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    slug,
    page.title,
    page.content || "",
    page.meta_description || "",
    page.is_published !== void 0 ? page.is_published ? 1 : 0 : 1,
    page.show_in_nav ? 1 : 0,
    page.nav_order || 999,
    page.show_page_header !== void 0 ? page.show_page_header ? 1 : 0 : 1
  ).run();
  return jsonResponse({
    success: true,
    message: "Page created successfully",
    id: result.meta.last_row_id,
    slug
  }, 201, corsHeaders);
}
__name(createPage, "createPage");
async function updatePage(request, env2, corsHeaders, id) {
  if (!verifyAuthentication(request)) {
    return jsonResponse({ error: "Unauthorized" }, 401, corsHeaders);
  }
  const page = await request.json();
  if (!page || typeof page !== "object") {
    return jsonResponse({ error: "Invalid input: page data is required" }, 400, corsHeaders);
  }
  const updates = [];
  const values = [];
  if (page.title !== void 0) {
    updates.push("title = ?");
    values.push(page.title);
  }
  if (page.content !== void 0) {
    updates.push("content = ?");
    values.push(page.content);
  }
  if (page.meta_description !== void 0) {
    updates.push("meta_description = ?");
    values.push(page.meta_description);
  }
  if (page.is_published !== void 0) {
    updates.push("is_published = ?");
    values.push(page.is_published ? 1 : 0);
  }
  if (page.show_in_nav !== void 0) {
    updates.push("show_in_nav = ?");
    values.push(page.show_in_nav ? 1 : 0);
  }
  if (page.nav_order !== void 0) {
    updates.push("nav_order = ?");
    values.push(page.nav_order);
  }
  if (page.show_page_header !== void 0) {
    updates.push("show_page_header = ?");
    values.push(page.show_page_header ? 1 : 0);
  }
  updates.push("updated_at = CURRENT_TIMESTAMP");
  values.push(id);
  await env2.DB.prepare(`
    UPDATE pages
    SET ${updates.join(", ")}
    WHERE id = ?
  `).bind(...values).run();
  return jsonResponse({ success: true, message: "Page updated successfully" }, 200, corsHeaders);
}
__name(updatePage, "updatePage");
async function deletePage(request, env2, corsHeaders, id) {
  if (!verifyAuthentication(request)) {
    return jsonResponse({ error: "Unauthorized" }, 401, corsHeaders);
  }
  await env2.DB.prepare("DELETE FROM pages WHERE id = ?").bind(id).run();
  return jsonResponse({ success: true, message: "Page deleted successfully" }, 200, corsHeaders);
}
__name(deletePage, "deletePage");
function jsonResponse(data, status = 200, additionalHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...additionalHeaders
    }
  });
}
__name(jsonResponse, "jsonResponse");

// api/settings/[[path]].js
function isLocalDevelopment2(request) {
  const url = new URL(request.url);
  return url.hostname === "localhost" || url.hostname === "127.0.0.1";
}
__name(isLocalDevelopment2, "isLocalDevelopment");
function verifyAuthentication2(request) {
  if (isLocalDevelopment2(request)) {
    return true;
  }
  const cookies = request.headers.get("Cookie") || "";
  const cfAccessToken = cookies.split(";").find((c) => c.trim().startsWith("CF_Authorization="));
  if (!cfAccessToken) {
    return false;
  }
  return true;
}
__name(verifyAuthentication2, "verifyAuthentication");
async function onRequest2(context2) {
  const { request, env: env2, params } = context2;
  const url = new URL(request.url);
  const path = params.path ? params.path.join("/") : "";
  const allowedOrigin = isLocalDevelopment2(request) ? "http://localhost:5173" : url.origin;
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    if (path === "site") {
      return handleSiteSettings(request, env2, corsHeaders);
    } else if (path === "homepage") {
      return handleHomepageSettings(request, env2, corsHeaders);
    } else if (path === "visit-page") {
      return handleVisitPageSettings(request, env2, corsHeaders);
    } else if (path === "about-page") {
      return handleAboutPageSettings(request, env2, corsHeaders);
    }
    return jsonResponse2({ error: "Not found" }, 404, corsHeaders);
  } catch (error3) {
    console.error("API Error:", error3);
    return jsonResponse2({ error: error3.message }, 500, corsHeaders);
  }
}
__name(onRequest2, "onRequest");
async function handleSiteSettings(request, env2, corsHeaders) {
  if (request.method === "GET") {
    const { results } = await env2.DB.prepare("SELECT key, value FROM site_settings").all();
    const settings = {};
    results.forEach((row) => {
      settings[row.key] = row.value;
    });
    return jsonResponse2(settings, 200, corsHeaders);
  }
  if (request.method === "PUT") {
    if (!verifyAuthentication2(request)) {
      return jsonResponse2({ error: "Unauthorized" }, 401, corsHeaders);
    }
    const settings = await request.json();
    if (!settings || typeof settings !== "object") {
      return jsonResponse2({ error: "Invalid input: settings must be an object" }, 400, corsHeaders);
    }
    const stmt = env2.DB.prepare("INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)");
    for (const [key, value] of Object.entries(settings)) {
      await stmt.bind(key, value).run();
    }
    return jsonResponse2({ success: true, message: "Settings updated successfully" }, 200, corsHeaders);
  }
  return jsonResponse2({ error: "Method not allowed" }, 405, corsHeaders);
}
__name(handleSiteSettings, "handleSiteSettings");
async function handleHomepageSettings(request, env2, corsHeaders) {
  if (request.method === "GET") {
    const { results } = await env2.DB.prepare("SELECT * FROM homepage_settings WHERE id = 1").all();
    const settings = results[0] || {};
    if (settings.show_live_stream !== void 0) {
      settings.showLiveStream = Boolean(settings.show_live_stream);
      delete settings.show_live_stream;
    }
    if (settings.hero_video_url !== void 0) {
      settings.heroVideoUrl = settings.hero_video_url;
      settings.heroImageUrl = settings.hero_image_url;
      settings.welcomeMessage = settings.welcome_message;
      settings.liveStreamUrl = settings.live_stream_url;
      delete settings.hero_video_url;
      delete settings.hero_image_url;
      delete settings.welcome_message;
      delete settings.live_stream_url;
    }
    return jsonResponse2(settings, 200, corsHeaders);
  }
  if (request.method === "PUT") {
    if (!verifyAuthentication2(request)) {
      return jsonResponse2({ error: "Unauthorized" }, 401, corsHeaders);
    }
    const settings = await request.json();
    if (!settings || typeof settings !== "object") {
      return jsonResponse2({ error: "Invalid input: settings must be an object" }, 400, corsHeaders);
    }
    await env2.DB.prepare(`
      UPDATE homepage_settings
      SET hero_video_url = ?,
          hero_image_url = ?,
          welcome_message = ?,
          live_stream_url = ?,
          show_live_stream = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).bind(
      settings.heroVideoUrl || "",
      settings.heroImageUrl || "",
      settings.welcomeMessage || "",
      settings.liveStreamUrl || "",
      settings.showLiveStream ? 1 : 0
    ).run();
    return jsonResponse2({ success: true, message: "Homepage settings updated successfully" }, 200, corsHeaders);
  }
  return jsonResponse2({ error: "Method not allowed" }, 405, corsHeaders);
}
__name(handleHomepageSettings, "handleHomepageSettings");
async function handleVisitPageSettings(request, env2, corsHeaders) {
  if (request.method === "GET") {
    const { results } = await env2.DB.prepare("SELECT * FROM visit_page_settings WHERE id = 1").all();
    const settings = results[0] || {};
    if (settings.page_title !== void 0) {
      settings.visitPageTitle = settings.page_title;
      settings.visitPageDescription = settings.page_description;
      delete settings.page_title;
      delete settings.page_description;
    }
    return jsonResponse2(settings, 200, corsHeaders);
  }
  if (request.method === "PUT") {
    if (!verifyAuthentication2(request)) {
      return jsonResponse2({ error: "Unauthorized" }, 401, corsHeaders);
    }
    const settings = await request.json();
    if (!settings || typeof settings !== "object") {
      return jsonResponse2({ error: "Invalid input: settings must be an object" }, 400, corsHeaders);
    }
    await env2.DB.prepare(`
      UPDATE visit_page_settings
      SET page_title = ?,
          page_description = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).bind(
      settings.visitPageTitle || "",
      settings.visitPageDescription || ""
    ).run();
    return jsonResponse2({ success: true, message: "Visit page settings updated successfully" }, 200, corsHeaders);
  }
  return jsonResponse2({ error: "Method not allowed" }, 405, corsHeaders);
}
__name(handleVisitPageSettings, "handleVisitPageSettings");
async function handleAboutPageSettings(request, env2, corsHeaders) {
  if (request.method === "GET") {
    const { results } = await env2.DB.prepare("SELECT * FROM about_page_settings WHERE id = 1").all();
    const settings = results[0] || {};
    if (settings.mission_statement !== void 0) {
      settings.missionStatement = settings.mission_statement;
      settings.ourHistory = settings.our_history;
      settings.ourBeliefs = settings.our_beliefs;
      delete settings.mission_statement;
      delete settings.our_history;
      delete settings.our_beliefs;
    }
    return jsonResponse2(settings, 200, corsHeaders);
  }
  if (request.method === "PUT") {
    if (!verifyAuthentication2(request)) {
      return jsonResponse2({ error: "Unauthorized" }, 401, corsHeaders);
    }
    const settings = await request.json();
    if (!settings || typeof settings !== "object") {
      return jsonResponse2({ error: "Invalid input: settings must be an object" }, 400, corsHeaders);
    }
    await env2.DB.prepare(`
      UPDATE about_page_settings
      SET mission_statement = ?,
          our_history = ?,
          our_beliefs = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).bind(
      settings.missionStatement || "",
      settings.ourHistory || "",
      settings.ourBeliefs || ""
    ).run();
    return jsonResponse2({ success: true, message: "About page settings updated successfully" }, 200, corsHeaders);
  }
  return jsonResponse2({ error: "Method not allowed" }, 405, corsHeaders);
}
__name(handleAboutPageSettings, "handleAboutPageSettings");
function jsonResponse2(data, status = 200, additionalHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...additionalHeaders
    }
  });
}
__name(jsonResponse2, "jsonResponse");

// api/media.js
function isLocalDevelopment3(request) {
  const url = new URL(request.url);
  return url.hostname === "localhost" || url.hostname === "127.0.0.1";
}
__name(isLocalDevelopment3, "isLocalDevelopment");
function verifyAuthentication3(request) {
  if (isLocalDevelopment3(request)) {
    return true;
  }
  const cookies = request.headers.get("Cookie") || "";
  const cfAccessToken = cookies.split(";").find((c) => c.trim().startsWith("CF_Authorization="));
  if (!cfAccessToken) {
    return false;
  }
  return true;
}
__name(verifyAuthentication3, "verifyAuthentication");
async function onRequestGet({ request, env: env2 }) {
  try {
    if (!verifyAuthentication3(request)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!env2.MEDIA_BUCKET) {
      return new Response(JSON.stringify({ error: "R2 bucket not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const listed = await env2.MEDIA_BUCKET.list();
    const files = listed.objects.map((obj) => ({
      fileKey: obj.key,
      fileName: obj.key.split("/").pop(),
      publicUrl: `${env2.R2_PUBLIC_URL}/${obj.key}`,
      size: obj.size,
      uploaded: obj.uploaded
    }));
    return new Response(JSON.stringify({ files }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error3) {
    console.error("List error:", error3);
    return new Response(JSON.stringify({ error: error3.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(onRequestGet, "onRequestGet");
async function onRequestDelete({ request, env: env2 }) {
  try {
    if (!verifyAuthentication3(request)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!env2.MEDIA_BUCKET) {
      return new Response(JSON.stringify({ error: "R2 bucket not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { fileKey } = await request.json();
    if (!fileKey) {
      return new Response(JSON.stringify({ error: "No file key provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await env2.MEDIA_BUCKET.delete(fileKey);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error3) {
    console.error("Delete error:", error3);
    return new Response(JSON.stringify({ error: error3.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(onRequestDelete, "onRequestDelete");

// api/upload.js
function isLocalDevelopment4(request) {
  const url = new URL(request.url);
  return url.hostname === "localhost" || url.hostname === "127.0.0.1";
}
__name(isLocalDevelopment4, "isLocalDevelopment");
function verifyAuthentication4(request) {
  if (isLocalDevelopment4(request)) {
    return true;
  }
  const cookies = request.headers.get("Cookie") || "";
  const cfAccessToken = cookies.split(";").find((c) => c.trim().startsWith("CF_Authorization="));
  if (!cfAccessToken) {
    return false;
  }
  return true;
}
__name(verifyAuthentication4, "verifyAuthentication");
async function onRequestPost({ request, env: env2 }) {
  try {
    if (!verifyAuthentication4(request)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!env2.MEDIA_BUCKET) {
      return new Response(JSON.stringify({ error: "R2 bucket not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "uploads";
    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: "File too large. Maximum size is 50MB" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/webm",
      "application/pdf",
      "audio/mpeg",
      "audio/wav"
    ];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: "File type not allowed" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileKey = `${folder}/${timestamp}-${sanitizedName}`;
    await env2.MEDIA_BUCKET.put(fileKey, file.stream(), {
      httpMetadata: {
        contentType: file.type
      }
    });
    const publicUrl = `${env2.R2_PUBLIC_URL}/${fileKey}`;
    return new Response(JSON.stringify({
      success: true,
      file: {
        fileKey,
        fileName: file.name,
        publicUrl,
        size: file.size,
        type: file.type
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error3) {
    console.error("Upload error:", error3);
    return new Response(JSON.stringify({ error: error3.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(onRequestPost, "onRequestPost");

// api/reset-website.js
import { join } from "path";
function isLocalDevelopment5(request) {
  const url = new URL(request.url);
  return url.hostname === "localhost" || url.hostname === "127.0.0.1";
}
__name(isLocalDevelopment5, "isLocalDevelopment");
function verifyAuthentication5(request) {
  if (isLocalDevelopment5(request)) {
    return true;
  }
  const cookies = request.headers.get("Cookie") || "";
  const cfAccessToken = cookies.split(";").find(
    (cookie) => cookie.trim().startsWith("CF_Authorization=")
  );
  return !!cfAccessToken;
}
__name(verifyAuthentication5, "verifyAuthentication");
async function onRequest3(context2) {
  const { request, env: env2 } = context2;
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": isLocalDevelopment5(request) ? "http://localhost:5173" : "https://bethanysda.pages.dev"
      }
    });
  }
  if (!verifyAuthentication5(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": isLocalDevelopment5(request) ? "http://localhost:5173" : "https://bethanysda.pages.dev"
      }
    });
  }
  try {
    const db = env2.DB;
    const defaultWebsiteSQL = `
      -- Clear existing pages
      DELETE FROM pages;

      -- Homepage
      INSERT INTO pages (slug, title, content, meta_description, is_published, show_in_nav, nav_order) VALUES (
        'home',
        'Homepage',
        '[{"id":"block-home-hero","type":"hero","content":{"title":"Welcome to Bethany SDA Church","subtitle":"Join us in worship, fellowship, and service as we grow together in faith","buttonText":"Plan Your Visit","buttonUrl":"/visit","backgroundType":"color","backgroundColor":"#0054a6"}},{"id":"block-home-welcome","type":"text","content":{"html":"<h2>Welcome Home</h2><p>Whether you are a long-time member or visiting for the first time, we are glad you are here.</p>"}},{"id":"block-home-services","type":"columns","content":{"columnCount":3,"columns":[{"blocks":[{"id":"card-sabbath","type":"card","content":{"icon":"\u{1F4D6}","title":"Sabbath School","description":"Saturdays at 9:30 AM","linkText":"","linkUrl":""}}]},{"blocks":[{"id":"card-worship","type":"card","content":{"icon":"\u{1F64F}","title":"Worship Service","description":"Saturdays at 11:00 AM","linkText":"","linkUrl":""}}]},{"blocks":[{"id":"card-prayer","type":"card","content":{"icon":"\u2728","title":"Prayer Meeting","description":"Wednesdays at 7:00 PM","linkText":"","linkUrl":""}}]}]}}]',
        'Welcome to Bethany SDA Church - Houston''s Haitian Seventh-day Adventist Community',
        1,
        0,
        1
      );

      -- Visit Page
      INSERT INTO pages (slug, title, content, meta_description, is_published, show_in_nav, nav_order) VALUES (
        'visit',
        'Plan Your Visit',
        '[{"id":"block-visit-hero","type":"hero","content":{"title":"Plan Your Visit","subtitle":"We would love to meet you!","buttonText":"","buttonUrl":"","backgroundType":"color","backgroundColor":"#28a745"}},{"id":"block-visit-intro","type":"text","content":{"html":"<h2>What to Expect</h2><p>Visiting a new church can be exciting! We want you to feel welcome from the moment you arrive.</p>"}}]',
        'Plan your visit to Bethany SDA Church',
        1,
        1,
        2
      );

      -- About Page
      INSERT INTO pages (slug, title, content, meta_description, is_published, show_in_nav, nav_order) VALUES (
        'about',
        'About Us',
        '[{"id":"block-about-hero","type":"hero","content":{"title":"About Us","subtitle":"Our mission, history, and beliefs","buttonText":"","buttonUrl":"","backgroundType":"color","backgroundColor":"#6c757d"}},{"id":"block-about-mission","type":"text","content":{"html":"<h2>Our Mission</h2><p>To glorify God by making disciples of Jesus Christ, nurturing spiritual growth, and serving our community with love.</p>"}}]',
        'Learn about Bethany SDA Church',
        1,
        1,
        3
      );
    `;
    const statements = defaultWebsiteSQL.split(";").filter((s) => s.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await db.prepare(statement).run();
      }
    }
    return new Response(JSON.stringify({
      success: true,
      message: "Website reset to default template successfully. Media files preserved."
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": isLocalDevelopment5(request) ? "http://localhost:5173" : "https://bethanysda.pages.dev",
        "Access-Control-Allow-Credentials": "true"
      }
    });
  } catch (error3) {
    console.error("Reset error:", error3);
    return new Response(JSON.stringify({
      error: "Failed to reset website",
      details: error3.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": isLocalDevelopment5(request) ? "http://localhost:5173" : "https://bethanysda.pages.dev"
      }
    });
  }
}
__name(onRequest3, "onRequest");

// ../.wrangler/tmp/pages-Te5ZbC/functionsRoutes-0.13827044434301816.mjs
var routes = [
  {
    routePath: "/api/pages/:path*",
    mountPath: "/api/pages",
    method: "",
    middlewares: [],
    modules: [onRequest]
  },
  {
    routePath: "/api/settings/:path*",
    mountPath: "/api/settings",
    method: "",
    middlewares: [],
    modules: [onRequest2]
  },
  {
    routePath: "/api/media",
    mountPath: "/api",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete]
  },
  {
    routePath: "/api/media",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/upload",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/reset-website",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest3]
  }
];

// ../../../../../opt/homebrew/Cellar/cloudflare-wrangler/4.45.4/libexec/lib/node_modules/wrangler/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count3 = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count3--;
          if (count3 === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count3++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count3)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../../../../opt/homebrew/Cellar/cloudflare-wrangler/4.45.4/libexec/lib/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env2, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context2 = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env: env2,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context2);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error3) {
      if (isFailOpen) {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error3;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// ../../../../../opt/homebrew/Cellar/cloudflare-wrangler/4.45.4/libexec/lib/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../../../opt/homebrew/Cellar/cloudflare-wrangler/4.45.4/libexec/lib/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-iXO1iI/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// ../../../../../opt/homebrew/Cellar/cloudflare-wrangler/4.45.4/libexec/lib/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-iXO1iI/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.7999219331605101.mjs.map
