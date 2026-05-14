// ===== STATE =====
const state = {
  logoUrl: null,
  sigUrl: null,
  hrSigUrl: null
};
 
// ===== CERT ID LOCAL STORAGE =====
function generateCertId(company) {
  const prefix = company
    ? company.replace(/[^A-Za-z]/g,' ').trim().split(/\s+/).map(w=>w[0]||'').join('').substring(0,3).toUpperCase()
    : 'INT';
  const year = new Date().getFullYear();
  // Get stored counter
  const storageKey = 'certify_id_counter';
  let counter = parseInt(localStorage.getItem(storageKey) || '0', 10) + 1;
  localStorage.setItem(storageKey, counter);
  return `${prefix || 'INT'}-${year}-${String(counter).padStart(4,'0')}`;
}
 
// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  scaleCertificate();
  window.addEventListener('resize', scaleCertificate);
  setTodayDate();
  loadSample();
});
 
function setTodayDate() {
  const today = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Kolkata'
  });
  document.getElementById('issueDate').value = today;
}
 
// ===== SCALING =====
function scaleCertificate() {
  const container = document.getElementById('cert-scale-container');
  const cert = document.getElementById('certificate');
  if (!container || !cert) return;
  const containerWidth = container.clientWidth;
  const certWidth = 840;
  const scale = Math.min(containerWidth / certWidth, 1);
  cert.style.transform = `scale(${scale})`;
  cert.style.transformOrigin = 'top left';
  container.style.height = (600 * scale) + 'px';
}
 
// ===== UPDATE CERTIFICATE =====
function updateCert() {
  const name = document.getElementById('studentName').value.trim() || 'Student Name';
  const gender = document.getElementById('gender').value;
  const college = document.getElementById('collegeName').value.trim() || '—';
  const domain = document.getElementById('domain').value.trim() || 'the specified domain';
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const duration = document.getElementById('duration').value.trim() || '—';
  const grade = document.getElementById('grade').value;
  const company = document.getElementById('companyName').value.trim() || 'Company Name';
  const mentor = document.getElementById('mentorName').value.trim() || 'Mentor Name';
  const mentorTitle = document.getElementById('mentorTitle').value.trim() || 'Program Coordinator';
  const certId = document.getElementById('certId').value.trim() || '——';
  const issueDate = document.getElementById('issueDate').value;
  const logoUrl = document.getElementById('certLogoImg').src = './logo.jpg';
  const signUrl = document.getElementById('sigPreview').src = './signature.png';
 
  // Prefix
  const prefix = gender === 'Female' ? 'Ms.' : gender === 'Male' ? 'Mr.' : '';
  document.getElementById('certStudentName').textContent = (prefix ? prefix + ' ' : '') + name;
 
  // Body text
  document.getElementById('certDomainInline').textContent = domain;
  document.getElementById('certCompanyInline').textContent = company;
 
  // Date range
  const dateRange = (startDate && endDate)
    ? `${formatDate(startDate)} to ${formatDate(endDate)}`
    : startDate ? `from ${formatDate(startDate)}` : '——';
  document.getElementById('certDateRange').textContent = dateRange;
 
  // Details grid
  document.getElementById('certDomainVal').textContent = domain === 'the specified domain' ? '—' : domain;
  document.getElementById('certDurationVal').textContent = duration;
  document.getElementById('certCollegeVal').textContent = college;
  document.getElementById('certGradeVal').textContent = grade;
 
  // Company
  document.getElementById('certCompanyName').textContent = company;
  document.getElementById('certCompanyFooter').textContent = company;
 
  // Cert ID & date
  document.getElementById('certCertId').textContent = certId;
  document.getElementById('certIssueDate').textContent = issueDate ? `Issue Date: ${formatDate(issueDate)}` : 'Issue Date: ——';
 
  // Mentor
  document.getElementById('certMentorName').textContent = mentor;
  document.getElementById('certMentorTitle').textContent = mentorTitle;
 
  // Watermark
  document.getElementById('certWatermarkText').textContent = company.length > 3 ? company.toUpperCase() : 'CERTIFIED';
}
 
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}
 
// ===== FILE UPLOADS =====
function handleLogoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    state.logoUrl = e.target.result;
    const prev = document.getElementById('logoPreview');
    prev.src = e.target.result; prev.style.display = 'block';
    document.getElementById('logoZone').querySelector('.upload-zone-icon').style.display = 'none';
    document.getElementById('logoZone').querySelector('.upload-zone-text').style.display = 'none';
    const img = document.getElementById('certLogoImg');
    img.src = e.target.result; img.style.display = 'block';
  };
  reader.readAsDataURL(file);
}
 
function handleSigUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    state.sigUrl = e.target.result;
    const prev = document.getElementById('sigPreview');
    prev.src = e.target.result; prev.style.display = 'block';
    document.getElementById('sigZone').querySelector('.upload-zone-icon').style.display = 'none';
    document.getElementById('sigZone').querySelector('.upload-zone-text').style.display = 'none';
    const container = document.getElementById('certSigImgContainer');
    container.style.display = 'block';
    document.getElementById('certSigImg').src = e.target.result;
  };
  reader.readAsDataURL(file);
}
 
// ===== LOAD SAMPLE =====
function loadSample() {
  document.getElementById('gender').value = 'Female';
  document.getElementById('collegeName').value = 'Shirish Madhukarrao Chaudhari College';
  document.getElementById('domain').value = 'Full Stack Web Development';
  document.getElementById('startDate').value = '2026-02-01';
  document.getElementById('endDate').value = '2026-05-31';
  document.getElementById('duration').value = '8 Weeks';
  document.getElementById('grade').value = 'Outstanding';
  document.getElementById('companyName').value = 'SGNexus Technologies';
  document.getElementById('mentorName').value = 'Shivhari Gadekar';
  document.getElementById('mentorTitle').value = 'Managing Director';
  // Auto-generate unique cert ID on first load
  if (!document.getElementById('certId').value) {
    document.getElementById('certId').value = generateCertId('SGNexus Technologies');
  }
  setTodayDate();
  updateCert();
}
 
// ===== RESET =====
function resetForm() {
  ['studentName','collegeName','domain','startDate','endDate',
   'duration','companyName','mentorName','mentorTitle'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('gender').value = 'Male';
  document.getElementById('grade').value = 'Outstanding';
  // Generate a fresh unique cert ID
  document.getElementById('certId').value = generateCertId('');
  setTodayDate();
  // Reset uploads
  state.logoUrl = state.sigUrl = state.hrSigUrl = null;
  document.getElementById('certLogoImg').style.display = 'none';
  document.getElementById('certSigImgContainer').style.display = 'none';
  updateCert();
  showToast('Form reset!', '🔄');
}
 
// ===== PDF DOWNLOAD =====
async function downloadPDF() {
  showLoading(true);
  try {
    const cert = document.getElementById('certificate');
    // Temporarily remove transform for capture
    const originalTransform = cert.style.transform;
    const originalOrigin = cert.style.transformOrigin;
    cert.style.transform = 'none';
    cert.style.transformOrigin = 'top left';
 
    const canvas = await html2canvas(cert, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 840,
      height: 600,
      logging: false,
    });
 
    cert.style.transform = originalTransform;
    cert.style.transformOrigin = originalOrigin;
 
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [840, 600] });
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    pdf.addImage(imgData, 'JPEG', 0, 0, 840, 600);
 
    const name = document.getElementById('studentName').value.trim() || 'Student';
    pdf.save(`${name.replace(/\s+/g,'_')}_Internship_Certificate.pdf`);
    showToast('PDF downloaded!', '✅');
  } catch (err) {
    console.error(err);
    showToast('Error generating PDF. Please try again.', '❌');
  }
  showLoading(false);
}
 
// ===== IMAGE DOWNLOAD =====
async function downloadImage() {
  showLoading(true);
  try {
    const cert = document.getElementById('certificate');
    const originalTransform = cert.style.transform;
    cert.style.transform = 'none';
 
    const canvas = await html2canvas(cert, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 840,
      height: 600,
      logging: false,
    });
 
    cert.style.transform = originalTransform;
 
    const link = document.createElement('a');
    const name = document.getElementById('studentName').value.trim() || 'Student';
    link.download = `${name.replace(/\s+/g,'_')}_Internship_Certificate.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Image downloaded!', '🖼️');
  } catch (err) {
    showToast('Error generating image.', '❌');
  }
  showLoading(false);
}
 
// ===== PRINT =====
function printCertificate() {
  const cert = document.getElementById('certificate');
  const originalTransform = cert.style.transform;
  cert.style.transform = 'none';
 
  const printWindow = window.open('', '_blank');
  const certHtml = cert.outerHTML;
  const styles = Array.from(document.styleSheets)
    .map(s => { try { return Array.from(s.cssRules).map(r => r.cssText).join('\n'); } catch(e){ return ''; } })
    .join('\n');
 
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Internship Certificate</title>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Playfair+Display:wght@700;800&family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,600&display=swap" rel="stylesheet">
      <style>
        ${styles}
        @page { size: A4 landscape; margin: 0; }
        body { margin: 0; padding: 0; background: white; }
        #certificate { transform: none !important; box-shadow: none; }
      </style>
    </head>
    <body>${certHtml}</body>
    </html>
  `);
  printWindow.document.close();
  setTimeout(() => { printWindow.focus(); printWindow.print(); }, 800);
 
  cert.style.transform = originalTransform;
}
 
// ===== UI HELPERS =====
function showLoading(show) {
  document.getElementById('loadingOverlay').classList.toggle('active', show);
}
 
let toastTimer = null;
function showToast(msg, icon = '✓') {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.querySelector('.toast-icon').textContent = icon;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}
