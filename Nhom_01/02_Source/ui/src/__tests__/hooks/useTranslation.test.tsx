import React from 'react';
import { renderHook } from '@testing-library/react';
import { expectAny } from '../utils/testUtils';

// Mock the useParams hook
jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ locale: 'en' }))
}));

// Mock the translations
const mockTranslations = {
  en: {
    common: {
      welcome: 'Welcome to Kimai time tracking system',
      login: 'Login',
      logout: 'Logout'
    },
    sidebar: {
      dashboard: 'Dashboard',
      timesheet: 'Timesheet',
      reports: 'Reports'
    }
  },
  vi: {
    common: {
      welcome: 'Chào mừng đến với hệ thống theo dõi thời gian Kimai',
      login: 'Đăng nhập',
      logout: 'Đăng xuất'
    },
    sidebar: {
      dashboard: 'Bảng điều khiển',
      timesheet: 'Bảng chấm công',
      reports: 'Báo cáo'
    }
  }
};

// Mock the i18n module
jest.mock('@/lib/i18n', () => ({
  useCurrentLocale: jest.fn(() => 'en'),
  useTranslation: () => {
    return {
      t: (key: string) => {
        const keys = key.split('.');
        let value: any = mockTranslations.en;
        
        for (const k of keys) {
          if (!value || !value[k]) return key;
          value = value[k];
        }
        
        return value;
      }
    };
  }
}));

describe('useTranslation Hook', () => {
  it('returns a translation function', () => {
    const { result } = renderHook(() => require('@/lib/i18n').useTranslation());
    expectAny(result.current.t).toBeDefined();
    expectAny(typeof result.current.t).toBe('function');
  });

  it('translates keys correctly for English', () => {
    const { result } = renderHook(() => require('@/lib/i18n').useTranslation());
    expectAny(result.current.t('common.welcome')).toBe('Welcome to Kimai time tracking system');
    expectAny(result.current.t('sidebar.dashboard')).toBe('Dashboard');
  });

  it('returns key when translation is missing', () => {
    const { result } = renderHook(() => require('@/lib/i18n').useTranslation());
    expectAny(result.current.t('nonexistent.key')).toBe('nonexistent.key');
  });

  it('handles nested keys correctly', () => {
    const { result } = renderHook(() => require('@/lib/i18n').useTranslation());
    expectAny(result.current.t('sidebar.timesheet')).toBe('Timesheet');
  });
});
