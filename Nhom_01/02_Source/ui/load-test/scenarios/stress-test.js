import { sleep } from 'k6';
import dashboard from '../scripts/dashboard.js';
import invoiceHistory from '../scripts/invoice-history.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

// Cấu hình kịch bản kiểm thử stress
export const options = {
  stages: [
    // Tăng nhanh từ 0 đến 50 người dùng trong 30 giây
    { duration: '30s', target: 50 },
    // Duy trì 50 người dùng trong 1 phút
    { duration: '1m', target: 50 },
    // Tăng đột biến lên 100 người dùng trong 30 giây
    { duration: '30s', target: 100 },
    // Duy trì 100 người dùng trong 1 phút
    { duration: '1m', target: 100 },
    // Giảm xuống 0 người dùng trong 30 giây
    { duration: '30s', target: 0 }
  ],
  thresholds: {
    // Thời gian phản hồi nghiêm ngặt hơn so với load test
    'http_req_duration': ['p(95)<1000', 'p(99)<1500'],
    // Đảm bảo tỷ lệ lỗi dưới 5%
    'http_req_failed': ['rate<0.05']
  },
  // Cấu hình xuất kết quả JSON
  ext: {
    loadimpact: {
      projectID: 3113612,
      name: 'Kimai Stress Test'
    }
  }
};

// Hàm chính thực thi kịch bản
export default function() {
  // Xác suất 50/50 giữa dashboard và invoice history
  if (Math.random() < 0.5) {
    console.log('Thực hiện kịch bản: dashboard (stress test)');
    dashboard();
  } else {
    console.log('Thực hiện kịch bản: invoice_history (stress test)');
    invoiceHistory();
  }
  
  // Thời gian nghỉ ngắn hơn giữa các request để tạo nhiều tải hơn
  sleep(Math.random() * 2 + 0.5);
}

// Tạo báo cáo HTML sau khi test hoàn thành
export function handleSummary(data) {
  return {
    './test-results/load-test-result/stress-test-summary.html': htmlReport(data),
    './test-results/load-test-result/stress-test-summary.json': JSON.stringify(data)
  };
}
