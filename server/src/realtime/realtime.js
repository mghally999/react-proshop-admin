let _io = null;

export function setIO(io) {
  _io = io;
}

export function emitEvent(event, payload) {
  if (!_io) return;
  _io.emit(event, payload);
}
