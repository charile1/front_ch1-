import { expect, test, vi } from 'vitest'

import { 구독, 발행기관 } from "../pubsub.js";

test('구독/발행 자동화 테스트', () => {

  const 상태 = 발행기관({ a: 10, b: 20 });

  const mockFn1 = vi.fn(() => `a = ${상태.a}`);
  const mockFn2 = vi.fn(() => `b = ${상태.b}`);
  const mockFn3 = vi.fn(() => `a + b = ${상태.a + 상태.b}`);
  const mockFn4 = vi.fn(() => `a * b = ${상태.a * 상태.b}`);
  const mockFn5 = vi.fn(() => `a - b = ${상태.a - 상태.b}`);

  구독(mockFn1);
  구독(mockFn2);
  구독(mockFn3);
  구독(mockFn4);
  구독(mockFn5);

  // 구독을 하면 일단 알림을 받는다.
  expect(mockFn1).toBeCalledTimes(1);
  expect(mockFn2).toBeCalledTimes(1);
  expect(mockFn3).toBeCalledTimes(1);
  expect(mockFn4).toBeCalledTimes(1);
  expect(mockFn5).toBeCalledTimes(1);
  expect(mockFn1).toReturnWith(`a = 10`);
  expect(mockFn2).toReturnWith(`b = 20`);
  expect(mockFn3).toReturnWith(`a + b = 30`);
  expect(mockFn4).toReturnWith(`a * b = 200`);
  expect(mockFn5).toReturnWith(`a - b = -10`);

  // 발행기관의 상태가 변경되면 알림을 전송한다.
  상태.a = 100;
  expect(mockFn1).toBeCalledTimes(2);
  expect(mockFn2).toBeCalledTimes(1); // b는 변경되지 않았기 때문에 알림을 받지 못했음.
  expect(mockFn3).toBeCalledTimes(2);
  expect(mockFn4).toBeCalledTimes(2);
  expect(mockFn5).toBeCalledTimes(2);
  expect(mockFn1).toReturnWith(`a = 100`);
  expect(mockFn2).toReturnWith(`b = 20`);
  expect(mockFn3).toReturnWith(`a + b = 120`);
  expect(mockFn4).toReturnWith(`a * b = 2000`);
  expect(mockFn5).toReturnWith(`a - b = 80`);

  상태.b = 200;
  expect(mockFn1).toBeCalledTimes(2);
  expect(mockFn2).toBeCalledTimes(2); // b도 변경이 되어 알림을 받음.
  expect(mockFn3).toBeCalledTimes(3);
  expect(mockFn4).toBeCalledTimes(3);
  expect(mockFn5).toBeCalledTimes(3);
  expect(mockFn1).toReturnWith(`a = 100`);
  expect(mockFn2).toReturnWith(`b = 200`);
  expect(mockFn3).toReturnWith(`a + b = 300`);
  expect(mockFn4).toReturnWith(`a * b = 20000`);
  expect(mockFn5).toReturnWith(`a - b = -100`);
})
