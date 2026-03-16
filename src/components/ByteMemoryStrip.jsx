import { formatAddress, toBinary, toHex } from "../utils/bitMath";

export default function ByteMemoryStrip({ bytes, baseAddress, label }) {
  return (
    <div className="memory-lesson">
      <div className="memory-lesson-head">
        <strong>{label}</strong>
        <span>Example uses little-endian byte order in memory.</span>
      </div>

      <div className="typed-memory-grid">
        {bytes.map((byte, index) => (
          <div key={`${baseAddress}-${index}`} className="typed-memory-cell">
            <span>{formatAddress(baseAddress + index)}</span>
            <strong>{toHex(byte)}</strong>
            <small>{toBinary(byte, 8)}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
