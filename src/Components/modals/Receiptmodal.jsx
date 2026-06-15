// src/components/modals/ReceiptModal.jsx
import { useEffect, useState } from 'react';
import { Modal } from '@components/shared/Modal';
import { Button } from '@components/shared/Button';
import { Spinner } from '@components/shared/Spinner';
import { useUI } from '@hooks/useUI';
import { ordersAPI, getImageUrl } from '@services/api';

// ── Helpers ──────────────────────────────────────────
const fmtCurr = (v) =>
  '₹' + (parseFloat(v) || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const VIDEO_EXTS = ['mp4', 'mov', 'avi', 'webm', 'mkv'];
const isVideo = (url) => VIDEO_EXTS.includes((url || '').split('.').pop().toLowerCase());

// ── Sub-components ───────────────────────────────────

const InfoRow = ({ label, value }) => (
  <div className="flex gap-2 py-1.5 border-b border-border last:border-0">
    <span className="font-manrope text-[10.5px] font-700 text-text-4 uppercase tracking-wide w-28 flex-shrink-0">
      {label}
    </span>
    <span className="font-manrope text-[12px] font-700 text-text flex-1">{value || '—'}</span>
  </div>
);

const ServiceTable = ({ services }) => (
  <table className="w-full border-collapse text-[11.5px]">
    <thead>
      <tr className="bg-bg2">
        <th className="px-3 py-2 text-left font-manrope font-800 text-text-4 uppercase tracking-wide text-[9.5px] w-7">#</th>
        <th className="px-3 py-2 text-left font-manrope font-800 text-text-4 uppercase tracking-wide text-[9.5px]">Service</th>
        <th className="px-3 py-2 text-right font-manrope font-800 text-text-4 uppercase tracking-wide text-[9.5px]">Amount</th>
      </tr>
    </thead>
    <tbody>
      {services && services.length > 0 ? (
        services.map((s, i) => (
          <tr key={i} className="border-b border-border last:border-0">
            <td className="px-3 py-2 text-text-4">{i + 1}</td>
            <td className="px-3 py-2 text-text">{s.service || '—'}</td>
            <td className="px-3 py-2 text-right font-bold text-text">{fmtCurr(s.total_price || 0)}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={3} className="px-3 py-4 text-center text-text-4 font-manrope text-[11px]">
            No services listed
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

const TotalsBlock = ({ subtotal, taxPct, taxAmt, grand }) => (
  <div className="border border-border rounded-lg overflow-hidden">
    <div className="flex justify-between px-4 py-2.5 border-b border-border">
      <span className="font-manrope text-[12px] text-text-3 font-600">Subtotal</span>
      <span className="font-manrope text-[12px] font-700 text-text">{fmtCurr(subtotal)}</span>
    </div>
    <div className="flex justify-between px-4 py-2.5 border-b border-border">
      <span className="font-manrope text-[12px] text-text-3 font-600">Tax ({taxPct || 0}%)</span>
      <span className="font-manrope text-[12px] font-700 text-warning">{fmtCurr(taxAmt)}</span>
    </div>
    <div className="flex justify-between px-4 py-3 bg-brand-light">
      <span className="font-manrope text-[13px] font-800 text-brand">Grand Total</span>
      <span className="font-sora text-[16px] font-900 text-brand">{fmtCurr(grand)}</span>
    </div>
  </div>
);

// ── QuotationCard — shows one side (Original / Duplicate) ────
const QuotationCard = ({ q, type, isFinal }) => {
  const isOrig = type === 'original';
  const services   = isOrig ? (q.service || [])           : (q.duplicate_service || []);
  const subtotal   = parseFloat(isOrig ? q.total_amount   : q.duplicate_total_amount)   || 0;
  const grand      = parseFloat(isOrig ? q.total_amount_inc_tax : q.duplicate_total_inc_tax) || 0;
  const taxPct     = isOrig ? q.tax_percent : q.duplicate_tax_percent;
  const taxAmt     = grand - subtotal;

  const accentColor = isOrig ? 'text-brand' : 'text-purple-600';
  const borderColor = isOrig ? 'border-brand/30' : 'border-purple-300';
  const bgHeader    = isOrig
    ? 'bg-gradient-to-br from-[#060f22] to-[#1d4ed8]'
    : 'bg-gradient-to-br from-[#060f22] to-[#7c3aed]';

  return (
    <div className={`border-2 ${borderColor} rounded-xl overflow-hidden flex flex-col`}>
      {/* Header */}
      <div className={`${bgHeader} px-5 py-4 text-white`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-base">🔧</div>
            <div>
              <div className="font-sora text-[15px] font-800">Gadgetfix365</div>
              <div className="font-manrope text-[9px] opacity-70">India's #1 Mobile Repair</div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-[9px] font-800 px-2.5 py-0.5 rounded-full ${isFinal ? 'bg-emerald-500' : 'bg-amber-500'}`}>
              {isFinal ? 'FINAL QUOTATION' : 'TEMP QUOTATION'}
            </span>
            <span className="text-[9px] font-800 px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30">
              {isOrig ? 'ORIGINAL' : 'DUPLICATE'}
            </span>
          </div>
        </div>
        <div className="font-manrope text-[9.5px] opacity-70">
          📞 +91 80709 00800 &nbsp;·&nbsp; ✉️ support@gadgetfix365.in
        </div>
      </div>

      {/* Quotation No + Date */}
      <div className="bg-bg2 px-4 py-2.5 flex justify-between items-center border-b border-border">
        <div>
          <div className="font-manrope text-[9px] text-text-4 font-800 uppercase tracking-wide">Quotation No.</div>
          <div className="font-sora text-[14px] font-900 text-text">#{q.quotation_no || '—'}</div>
        </div>
        <div className="text-right">
          <div className="font-manrope text-[9px] text-text-4 font-800 uppercase tracking-wide">Date</div>
          <div className="font-manrope text-[11px] font-700 text-text">
            {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Customer & Device */}
      <div className="px-4 py-3 border-b border-border">
        <div className="font-manrope text-[9px] text-text-4 font-800 uppercase tracking-wide mb-2">
          Customer &amp; Device
        </div>
        <div className="bg-bg2 rounded-lg px-3 py-2.5 space-y-0.5">
          <InfoRow label="Customer"  value={q.name} />
          <InfoRow label="Mobile"    value={q.mobile_no + (q.alternate_mobile ? ` / ${q.alternate_mobile}` : '')} />
          <InfoRow label="Device"    value={`${q.brand_name || ''} ${q.model_name || ''}`} />
          <InfoRow label="Category"  value={q.category_name} />
          <InfoRow label="Problem"   value={q.problem_title} />
          {q.problem_as_per_technician && (
            <InfoRow label="Tech Diag." value={q.problem_as_per_technician} />
          )}
          {q.problem_description_as_per_technician && (
            <InfoRow label="Tech Notes" value={q.problem_description_as_per_technician} />
          )}
        </div>
      </div>

      {/* Services */}
      <div className="px-4 py-3 border-b border-border">
        <div className="font-manrope text-[9px] text-text-4 font-800 uppercase tracking-wide mb-2">
          Services ({isOrig ? 'Original' : 'Duplicate'})
        </div>
        <div className="border border-border rounded-lg overflow-hidden">
          <ServiceTable services={services} />
        </div>
      </div>

      {/* Totals */}
      <div className="px-4 py-3 border-b border-border">
        <TotalsBlock
          subtotal={subtotal}
          taxPct={taxPct}
          taxAmt={taxAmt}
          grand={grand}
        />
      </div>

      {/* Footer note */}
      <div className="px-4 py-2.5 text-center font-manrope text-[9.5px] text-text-4 bg-bg2">
        {isFinal
          ? '✅ This is your Final Quotation after device inspection.'
          : '⏳ Temporary Quotation. Final quote may vary after inspection.'}
      </div>
    </div>
  );
};

// ── Main ReceiptModal ─────────────────────────────────
export const ReceiptModal = ({ isOpen, onClose, orderId }) => {
  const { showToast } = useUI();
  const [isLoading, setIsLoading] = useState(false);
  const [quotation, setQuotation]   = useState(null);
  const [isFinal, setIsFinal]       = useState(false);
  const [error, setError]           = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);

  useEffect(() => {
    if (!isOpen || !orderId) return;
    fetchQuotation();
  }, [isOpen, orderId]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setQuotation(null);
      setIsFinal(false);
      setError('');
      setMediaFiles([]);
    }
  }, [isOpen]);
const fetchQuotation = async () => {
  setIsLoading(true);
  setError('');
  setQuotation(null);

  try {
    // Try final quotation first
    const finalData = await ordersAPI.getFinalQuotation(orderId);
    if (finalData.status === 'success' && finalData.final_quotation) {
      setIsFinal(true);
      setQuotation(finalData.final_quotation);
      setMediaFiles(
        Array.isArray(finalData.final_quotation.device_media)
          ? finalData.final_quotation.device_media
          : []
      );
      setIsLoading(false); // ← ADD THIS
      return;
    }
  } catch { /* fall through */ }

  try {
    const data = await ordersAPI.getQuotation(orderId);
    if (data.status === 'success' && data.quotation) {
      setIsFinal(false);
      setQuotation(data.quotation);
    } else {
      setError(data.message || 'Quotation not available yet.');
    }
  } catch {
    setError('Could not load quotation. Please try again.');
  } finally {
    setIsLoading(false); // ← only second try-catch la apply hote
  }
};

  const handlePrint = () => {
    if (!quotation) return;
    const title  = isFinal ? 'Final Quotation Receipt' : 'Temporary Quotation Receipt';
    const badge  = isFinal ? '✅ Final Quotation'      : '⏳ Temporary Quotation';
    const badgeColor = isFinal ? '#059669' : '#D97706';

    const buildSide = (type) => {
      const isOrig   = type === 'original';
      const services = isOrig ? (quotation.service || []) : (quotation.duplicate_service || []);
      const subtotal = parseFloat(isOrig ? quotation.total_amount : quotation.duplicate_total_amount) || 0;
      const grand    = parseFloat(isOrig ? quotation.total_amount_inc_tax : quotation.duplicate_total_inc_tax) || 0;
      const taxPct   = isOrig ? quotation.tax_percent : quotation.duplicate_tax_percent;
      const taxAmt   = grand - subtotal;
      const accentClr = isOrig ? '#1252D3' : '#7C3AED';
      const label    = isOrig ? 'ORIGINAL' : 'DUPLICATE';
      const now      = new Date();
      const dateStr  = now.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
      const timeStr  = now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });

      const serviceRows = services.length
        ? services.map((s, i) => `
            <tr style="border-bottom:1px solid #eee">
              <td style="padding:7px 10px;font-size:12px;color:#6B7A99">${i + 1}</td>
              <td style="padding:7px 10px;font-size:12px;color:#0D1526">${s.service || '—'}</td>
              <td style="padding:7px 10px;font-size:12px;font-weight:700;color:#0D1526;text-align:right">
                ₹${(parseFloat(s.total_price) || 0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}
              </td>
            </tr>`).join('')
        : `<tr><td colspan="3" style="padding:10px;text-align:center;color:#999;font-size:11px">No services listed</td></tr>`;

      const fmtV = (v) => '₹' + (parseFloat(v)||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});

      return `
        <div style="width:48%;display:inline-block;vertical-align:top;border:2px solid ${accentClr};border-radius:12px;overflow:hidden;font-family:sans-serif;background:#fff;box-shadow:0 4px 24px rgba(0,0,0,.10)">
          <div style="background:linear-gradient(135deg,#060f22,${accentClr});padding:16px 18px;color:#fff">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
              <div style="display:flex;align-items:center;gap:9px">
                <div style="width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;font-size:16px">🔧</div>
                <div><div style="font-size:16px;font-weight:800">Gadgetfix365</div><div style="font-size:9px;opacity:.72">India's #1 Mobile Repair</div></div>
              </div>
              <div style="display:flex;flex-direction:column;align-items:flex-end;gap:5px">
                <div style="background:${badgeColor};border-radius:20px;padding:2px 10px;font-size:9px;font-weight:800;letter-spacing:1.2px">${isFinal ? 'FINAL QUOTATION' : 'TEMP QUOTATION'}</div>
                <div style="background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.35);border-radius:20px;padding:2px 10px;font-size:9px;font-weight:800">${label}</div>
              </div>
            </div>
            <div style="font-size:9.5px;opacity:.72">📞 +91 80709 00800 · ✉️ support@gadgetfix365.in</div>
          </div>
          <div style="background:#f0f5ff;padding:10px 16px;border-bottom:1px solid #dde8ff;display:flex;justify-content:space-between;align-items:center">
            <div><div style="font-size:9px;color:#6B7A99;font-weight:700;text-transform:uppercase">Quotation No.</div>
            <div style="font-size:14px;font-weight:900;color:#0D1526">#${quotation.quotation_no || ''}</div></div>
            <div style="text-align:right"><div style="font-size:9px;color:#6B7A99;font-weight:700;text-transform:uppercase">Date</div>
            <div style="font-size:11px;font-weight:700;color:#0D1526">${dateStr} · ${timeStr}</div></div>
          </div>
          <div style="padding:12px 16px;border-bottom:1px solid #eee">
            <div style="font-size:9px;font-weight:800;color:#6B7A99;text-transform:uppercase;margin-bottom:7px">Customer &amp; Device</div>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="font-size:10.5px;color:#6B7A99;padding:2px 0;width:36%">Customer</td><td style="font-size:10.5px;font-weight:700;color:#0D1526">${quotation.name || '—'}</td></tr>
              <tr><td style="font-size:10.5px;color:#6B7A99;padding:2px 0">Mobile</td><td style="font-size:10.5px;font-weight:700;color:#0D1526">${quotation.mobile_no || '—'}</td></tr>
              <tr><td style="font-size:10.5px;color:#6B7A99;padding:2px 0">Device</td><td style="font-size:10.5px;font-weight:700;color:#0D1526">${quotation.brand_name || ''} ${quotation.model_name || '—'}</td></tr>
              <tr><td style="font-size:10.5px;color:#6B7A99;padding:2px 0">Problem</td><td style="font-size:10.5px;font-weight:600;color:#0D1526">${quotation.problem_title || '—'}</td></tr>
              ${quotation.problem_as_per_technician ? `<tr><td style="font-size:9.5px;color:#6B7A99;padding:3px 0">Tech Diag.</td><td style="font-size:9.5px;color:${accentClr};font-weight:700">${quotation.problem_as_per_technician}</td></tr>` : ''}
            </table>
          </div>
          <div style="padding:12px 16px;border-bottom:1px solid #eee">
            <div style="font-size:9px;font-weight:800;color:#6B7A99;text-transform:uppercase;margin-bottom:6px">Services (${label})</div>
            <table style="width:100%;border-collapse:collapse">
              <thead><tr style="background:#f7f9fc">
                <th style="padding:6px 10px;font-size:9px;font-weight:800;color:#6B7A99;text-align:left;width:24px">#</th>
                <th style="padding:6px 10px;font-size:9px;font-weight:800;color:#6B7A99;text-align:left">Service</th>
                <th style="padding:6px 10px;font-size:9px;font-weight:800;color:#6B7A99;text-align:right">Amount</th>
              </tr></thead>
              <tbody>${serviceRows}</tbody>
            </table>
          </div>
          <div style="padding:10px 16px;background:#fafbff;border-bottom:1px dashed #cdd8f0">
            <div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:11px;color:#6B7A99">Subtotal</span><span style="font-size:11px;font-weight:600;color:#0D1526">${fmtV(subtotal)}</span></div>
            <div style="display:flex;justify-content:space-between"><span style="font-size:11px;color:#6B7A99">Tax (${taxPct || 0}%)</span><span style="font-size:11px;font-weight:600;color:#D97706">${fmtV(taxAmt)}</span></div>
          </div>
          <div style="padding:11px 16px;background:linear-gradient(135deg,#f0f5ff,#e8efff);border-bottom:1px solid #dde8ff;display:flex;justify-content:space-between;align-items:center">
            <span style="font-size:12px;font-weight:800;color:#0D1526">GRAND TOTAL</span>
            <span style="font-size:17px;font-weight:900;color:${accentClr}">${fmtV(grand)}</span>
          </div>
          <div style="padding:10px 16px;text-align:center;background:#fff;font-size:9px;color:#6B7A99">
            ${isFinal ? '✅ Final Quotation after device inspection.' : '⏳ Temporary Quotation. May vary after inspection.'}
          </div>
        </div>`;
    };

    const html = `<!DOCTYPE html><html><head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:sans-serif;background:#f0f4f8;padding:20px}.wrap{max-width:920px;margin:0 auto}.head{text-align:center;margin-bottom:18px}.badge{display:inline-block;background:${badgeColor};color:#fff;font-size:11px;font-weight:800;padding:4px 14px;border-radius:20px;margin-bottom:6px}.cols{display:flex;gap:4%;justify-content:center}.cols>div{width:48%}@media print{body{background:#fff;padding:4mm}@page{margin:6mm;size:A4}}</style>
    </head><body>
      <div class="wrap">
        <div class="head">
          <div class="badge">${badge}</div>
          <h1 style="font-size:20px;font-weight:900;color:#0D1526;margin-bottom:4px">🧾 ${title}</h1>
          <p style="font-size:11px;color:#6B7A99">#${quotation.quotation_no || ''} · ${quotation.name || ''} · ${quotation.brand_name || ''} ${quotation.model_name || ''}</p>
        </div>
        <div class="cols">
          ${buildSide('original')}
          ${buildSide('duplicate')}
        </div>
      </div>
      <script>window.onload=function(){setTimeout(function(){window.print()},500)}<\/script>
    </body></html>`;

    const pw = window.open('', '_blank', 'width=980,height=720');
    if (!pw) { showToast('⚠️ Allow popups to print receipt.', 'error'); return; }
    pw.document.write(html);
    pw.document.close();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" showCloseButton={false}>
      {/* Header */}
      <div className="bg-gradient-brand px-7 py-5 text-white flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="font-sora text-[19px] font-extrabold tracking-tight mb-0.5">
            🧾 {isFinal ? 'Final Quotation Receipt' : 'Temp Quotation Receipt'}
          </h2>
          <p className="font-manrope text-[12px] opacity-80">
            {isFinal
              ? 'Final quote after physical inspection by technician'
              : 'Temporary quote — may change after device inspection'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-[34px] h-[34px] rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 hover:rotate-90 transition-all"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Body */}
      <div className="p-5 overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-14 text-text-4">
            <div className="text-4xl mb-3">🧾</div>
            <h3 className="font-sora text-[14px] font-bold mb-1.5">Receipt Not Available</h3>
            <p className="font-manrope text-[12px]">{error}</p>
          </div>
        ) : quotation ? (
          <>
            {/* Quotation type badge */}
            <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border mb-5 font-manrope text-[12.5px] font-bold ${
              isFinal
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}>
              <span className="text-lg">{isFinal ? '✅' : '⏳'}</span>
              <span>
                {isFinal
                  ? 'Final Quotation — generated after physical device inspection'
                  : 'Temporary Quotation — final amount may vary after inspection'}
              </span>
            </div>

            {/* Device media (final quotation only) */}
            {isFinal && mediaFiles.length > 0 && (
              <div className="mb-5">
                <div className="font-manrope text-[10px] font-800 text-text-4 uppercase tracking-wide mb-2">
                  Device Photos by Technician
                </div>
                <div className="flex gap-2 flex-wrap">
                  {mediaFiles.map((m, i) => {
                    const url = getImageUrl(m);
                    return isVideo(url) ? (
                      <video
                        key={i}
                        src={url}
                        controls
                        className="w-[110px] h-[80px] object-cover rounded-lg bg-black"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <img
                        key={i}
                        src={url}
                        alt="Device"
                        className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform shadow-sm"
                        onClick={() => window.open(url, '_blank')}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Side-by-side quotation cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuotationCard q={quotation} type="original"  isFinal={isFinal} />
              <QuotationCard q={quotation} type="duplicate" isFinal={isFinal} />
            </div>
          </>
        ) : null}
      </div>

      {/* Footer */}
      {!isLoading && !error && quotation && (
        <div className="px-6 py-4 border-t border-border bg-bg2 flex items-center justify-between gap-3 sticky bottom-0">
          <p className="font-manrope text-[11px] text-text-4 font-500">
            Both Original and Duplicate quotations shown side by side for your comparison.
          </p>
          <div className="flex gap-2.5 flex-shrink-0">
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              icon={<i className="fas fa-print"></i>}
            >
              Print Receipt
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
