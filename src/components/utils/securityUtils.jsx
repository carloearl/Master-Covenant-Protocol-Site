export const generateSHA256 = async (text) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const performStaticURLChecks = (url) => {
  let score = 100;
  const issues = [];

  try {
    const urlObj = new URL(url);
    
    if (urlObj.protocol !== 'https:') {
      score -= 30;
      issues.push("Non-HTTPS protocol detected");
    }

    const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top'];
    if (suspiciousTlds.some(tld => urlObj.hostname.endsWith(tld))) {
      score -= 20;
      issues.push("Suspicious TLD");
    }

    if (/^\d+\.\d+\.\d+\.\d+$/.test(urlObj.hostname)) {
      score -= 25;
      issues.push("Naked IP address");
    }

    const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly'];
    if (shorteners.some(s => urlObj.hostname.includes(s))) {
      score -= 15;
      issues.push("URL shortener detected");
    }

    if (url.length > 500) {
      score -= 10;
      issues.push("Excessive URL length");
    }

  } catch (e) {
    score = 0;
    issues.push("Invalid URL format");
  }

  return { score: Math.max(0, score), issues };
};

export const getSeverityColor = (severity) => {
  switch(severity) {
    case "critical": return "bg-red-500/20 text-red-400 border-red-500/50";
    case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
    case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
    case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
  }
};

export const getStatusColor = (status) => {
  switch(status) {
    case "detected": return "bg-red-500/20 text-red-400 border-red-500/50";
    case "investigating": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
    case "contained": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    case "resolved": return "bg-green-500/20 text-green-400 border-green-500/50";
    case "false_positive": return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
  }
};

export const getScoreColor = (score) => {
  if (score >= 80) return "text-green-400";
  if (score >= 65) return "text-yellow-400";
  return "text-red-400";
};