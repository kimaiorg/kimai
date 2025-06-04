import { sleep } from 'k6';
import dashboard from '../scripts/dashboard.js';
import invoiceHistory from '../scripts/invoice-history.js';
import auth from '../scripts/auth.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

// Cấu hình kịch bản kiểm thử tải
export const options = {
  stages: [
    // Tăng dần số lượng người dùng từ 0 đến 10 trong 30 giây
    { duration: '30s', target: 10 },
    // Duy trì 10 người dùng trong 1 phút
    { duration: '1m', target: 10 },
    // Tăng lên 20 người dùng trong 30 giây
    { duration: '30s', target: 20 },
    // Duy trì 20 người dùng trong 1 phút
    { duration: '1m', target: 20 },
    // Giảm xuống 0 người dùng trong 30 giây
    { duration: '30s', target: 0 }
  ],
  thresholds: {
    // Đảm bảo 95% request có thời gian phản hồi dưới 500ms
    'http_req_duration': ['p(95)<500'],
    // Đảm bảo tỷ lệ lỗi dưới 1%
    'http_req_failed': ['rate<0.01']
  },
  // Cấu hình xuất kết quả JSON
  ext: {
    loadimpact: {
      projectID: 3113611,
      name: 'Kimai Load Test'
    }
  }
};

// Danh sách các kịch bản có thể thực hiện
const scenarios = [
  { name: 'auth', weight: 20, fn: auth },
  { name: 'dashboard', weight: 40, fn: dashboard },
  { name: 'invoice_history', weight: 40, fn: invoiceHistory }
];

// Tổng trọng số
const totalWeight = scenarios.reduce((sum, scenario) => sum + scenario.weight, 0);

// Hàm chính thực thi kịch bản
export default function() {
  // Chọn kịch bản dựa trên trọng số
  const random = Math.random() * totalWeight;
  let sum = 0;
  let selectedScenario = scenarios[0].fn;
  
  for (const scenario of scenarios) {
    sum += scenario.weight;
    if (random <= sum) {
      console.log(`Thực hiện kịch bản: ${scenario.name}`);
      selectedScenario = scenario.fn;
      break;
    }
  }
  
  // Thực thi kịch bản đã chọn
  selectedScenario();
  
  // Đợi ngẫu nhiên từ 1-5 giây giữa các lần thực hiện
  sleep(Math.random() * 4 + 1);
}

// Tạo báo cáo HTML sau khi test hoàn thành
export function handleSummary(data) {
  return {
    '../../test-results/load-test-result/load-test-summary.html': htmlReport(data),
    '../../test-results/load-test-result/load-test-summary.json': JSON.stringify(data)
  };
}
