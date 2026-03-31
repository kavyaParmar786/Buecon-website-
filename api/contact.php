<?php
/* ═══════════════════════════════════════════
   BUECON — Contact Form API (PHP + mail)
   For shared hosting / cPanel environments
   
   For Node.js: see contact.js in this folder
   ═══════════════════════════════════════════ */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200); exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid JSON']);
  exit;
}

/* ── Sanitise ── */
function clean($v) { return htmlspecialchars(strip_tags(trim($v ?? '')), ENT_QUOTES, 'UTF-8'); }

$name     = clean($data['name']     ?? '');
$email    = clean($data['email']    ?? '');
$phone    = clean($data['phone']    ?? '');
$interest = clean($data['interest'] ?? '');
$message  = clean($data['message']  ?? '');

/* ── Validate ── */
if (!$name || !$email || !$message) {
  http_response_code(422);
  echo json_encode(['error' => 'Required fields missing']);
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422);
  echo json_encode(['error' => 'Invalid email']);
  exit;
}

/* ── Build email ── */
$to      = 'kavyaparmar7866@gmail.com';
$subject = "BUECON Enquiry — {$name}";
$body    = "
New enquiry from the BUECON website:

Name:     {$name}
Email:    {$email}
Phone:    {$phone}
Interest: {$interest}

Message:
{$message}

---
Sent via buecon.in contact form
";

$headers  = "From: noreply@buecon.in\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

/* ── Send ── */
if (mail($to, $subject, $body, $headers)) {
  http_response_code(200);
  echo json_encode(['success' => true, 'message' => 'Email sent']);
} else {
  http_response_code(500);
  echo json_encode(['error' => 'Mail function failed — check server mail config']);
}
