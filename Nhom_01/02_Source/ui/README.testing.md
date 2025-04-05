## Mục Lục

1. [Chạy Unit Tests](#chạy-unit-tests)
2. [Phân Tích Hiệu Suất](#phân-tích-hiệu-suất)
3. [Đảm Bảo Chất Lượng Code](#đảm-bảo-chất-lượng-code)
4. [Quy Trình Phát Triển](#quy-trình-phát-triển)

## Chạy Unit Tests

### Chạy Tất Cả Tests

```bash
npm run test
```

### Chạy Tests ở Chế Độ Watch

```bash
npm run test:watch
```

### Kiểm Tra Độ Phủ Code

```bash
npm run test:coverage
```

### Cấu Trúc Tests

Tests được tổ chức theo cấu trúc sau:

- `src/__tests__/components/`: Tests cho các components
- `src/__tests__/hooks/`: Tests cho các custom hooks
- `src/__tests__/api/`: Tests cho các API calls
- `src/__tests__/middleware/`: Tests cho middleware

### Viết Tests Mới

Khi viết tests mới, hãy tuân theo các quy tắc sau:

1. Đặt tên file test là `[tên-file].test.tsx` hoặc `[tên-file].test.ts`
2. Sử dụng React Testing Library cho component tests
3. Mock các dependencies khi cần thiết
4. Kiểm tra các trường hợp thành công và thất bại

Ví dụ test cho component:

```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Phân Tích Hiệu Suất

### Phân Tích Bundle Size

```bash
npm run analyze
```

Lệnh này sẽ tạo ra báo cáo phân tích bundle size trong thư mục `.next/analyze`.

### Tối Ưu Hóa Code Splitting

Sử dụng dynamic imports để tối ưu hóa code splitting:

```typescript
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false // Tắt SSR nếu component không cần thiết khi tải trang ban đầu
});
```

### Tối Ưu Hóa Hình Ảnh

Sử dụng Next.js Image component để tối ưu hóa hình ảnh:

```typescript
import Image from 'next/image';

export default function OptimizedImage() {
  return (
    <Image
      src="/path/to/image.jpg"
      alt="Description"
      width={500}
      height={300}
      priority={false}
      loading="lazy"
    />
  );
}
```

## Đảm Bảo Chất Lượng Code

### Kiểm Tra Linting

```bash
npm run lint
```

### Format Code

```bash
npm run format
```

### Kiểm Tra Format

```bash
npm run check-format
```

### Pre-commit Hooks

Dự án đã được cấu hình với Husky và lint-staged để tự động kiểm tra code trước khi commit. Các kiểm tra bao gồm:

- ESLint để kiểm tra lỗi
- Prettier để đảm bảo định dạng nhất quán
- TypeScript để kiểm tra kiểu dữ liệu

### Quy Tắc Đặt Tên

- **Components**: PascalCase (ví dụ: `UserProfile.tsx`)
- **Hooks**: camelCase với tiền tố `use` (ví dụ: `useTranslation.ts`)
- **Utilities**: camelCase (ví dụ: `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (ví dụ: `API_ENDPOINTS.ts`)

## Quy Trình Phát Triển

### Quy Trình Làm Việc

1. **Tạo Branch**: Tạo branch mới từ `main` cho mỗi tính năng hoặc fix
2. **Viết Tests**: Viết tests trước khi triển khai tính năng (TDD)
3. **Triển Khai**: Triển khai tính năng hoặc fix
4. **Kiểm Tra Locally**: Chạy tests và linting locally
5. **Tạo Pull Request**: Tạo PR và đợi review
6. **Merge**: Sau khi được approve, merge vào `main`

### Tối Ưu Hóa Đa Ngôn Ngữ

Dự án sử dụng cấu trúc đa ngôn ngữ với các thư mục:

- `(locales)/[locale]/`: Chứa các trang có tiền tố ngôn ngữ
- `(pages)/`: Chứa các trang gốc (được sử dụng làm fallback)

Khi thêm tính năng mới, hãy đảm bảo:

1. Thêm các khóa dịch vào `src/lib/i18n/translations/`
2. Sử dụng hook `useTranslation` để truy cập các bản dịch
3. Cập nhật middleware nếu cần thiết

## Tài Liệu Tham Khảo

- [Unit-Test.md](./Unit-Test.md): Tài liệu chi tiết về chiến lược testing, scaling và maintenance
- [Next.js Documentation](https://nextjs.org/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
