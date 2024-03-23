import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { Store } from "../store.js";
import { 구독 } from "../pubsub.js";

let store = null;

const InputA = vi.fn(() => `<input id="stateA" value="${store.state.a}" size="5" />`);
const InputB = vi.fn(() => `<input id="stateB" value="${store.state.b}" size="5" />`);
const Calculator = vi.fn(() => `<p>a + b = ${store.state.a + store.state.b}</p>`);
const App = vi.fn(() => `${InputA()}<br />${InputB()}<br />${Calculator()}`);

describe('store 테스트 > ', () => {
  describe('InputA, InputB, Calculator, App 를 다 구독하는 경우 > ', () => {
    beforeEach(() => {
      vi.clearAllMocks();

      store = new Store({
        state: { a: 10, b: 20 },
        mutations: {
          SET_A(state, payload) {
            state.a = payload;
          },
          SET_B(state, payload) {
            state.b = payload;
          }
        },
      });

      구독(InputA);
      구독(InputB);
      구독(Calculator);
      구독(App);
    })

    test('초기 호출 결과', () => {

      expect(InputA).toBeCalledTimes(2);
      expect(InputB).toBeCalledTimes(2);
      expect(Calculator).toBeCalledTimes(2);
      expect(App).toBeCalledTimes(1);

      expect(InputA).toReturnWith(`<input id="stateA" value="10" size="5" />`)
      expect(InputB).toReturnWith(`<input id="stateB" value="20" size="5" />`)
      expect(Calculator).toReturnWith(`<p>a + b = 30</p>`)
      expect(App).toReturnWith(`<input id="stateA" value="10" size="5" /><br /><input id="stateB" value="20" size="5" /><br /><p>a + b = 30</p>`)
    })

    test('store.state.a의 값만 변경되는 경우', () => {
      expect(InputA).toBeCalledTimes(2);
      expect(InputB).toBeCalledTimes(2);
      expect(Calculator).toBeCalledTimes(2);
      expect(App).toBeCalledTimes(1);

      expect(InputA).toReturnWith(`<input id="stateA" value="10" size="5" />`)
      expect(InputB).toReturnWith(`<input id="stateB" value="20" size="5" />`)
      expect(Calculator).toReturnWith(`<p>a + b = 30</p>`)
      expect(App).toReturnWith(`<input id="stateA" value="10" size="5" /><br /><input id="stateB" value="20" size="5" /><br /><p>a + b = 30</p>`)

      store.commit('SET_A', 100);

      expect(InputA).toBeCalledTimes(4);
      expect(InputB).toBeCalledTimes(3);
      expect(Calculator).toBeCalledTimes(4);
      expect(App).toBeCalledTimes(2);

      expect(InputA).toReturnWith(`<input id="stateA" value="100" size="5" />`)
      expect(InputB).toReturnWith(`<input id="stateB" value="20" size="5" />`)
      expect(Calculator).toReturnWith(`<p>a + b = 120</p>`)
      expect(App).toReturnWith(`<input id="stateA" value="100" size="5" /><br /><input id="stateB" value="20" size="5" /><br /><p>a + b = 120</p>`)
    })

    test('store.state.a와 b의 값이 각각 변경는 경우', () => {
      expect(InputA).toBeCalledTimes(2);
      expect(InputB).toBeCalledTimes(2);
      expect(Calculator).toBeCalledTimes(2);
      expect(App).toBeCalledTimes(1);

      expect(InputA).toReturnWith(`<input id="stateA" value="10" size="5" />`)
      expect(InputB).toReturnWith(`<input id="stateB" value="20" size="5" />`)
      expect(Calculator).toReturnWith(`<p>a + b = 30</p>`)
      expect(App).toReturnWith(`<input id="stateA" value="10" size="5" /><br /><input id="stateB" value="20" size="5" /><br /><p>a + b = 30</p>`)

      store.commit('SET_A', 100);

      expect(InputA).toBeCalledTimes(4);
      expect(InputB).toBeCalledTimes(3);
      expect(Calculator).toBeCalledTimes(4);
      expect(App).toBeCalledTimes(2);

      expect(InputA).toReturnWith(`<input id="stateA" value="100" size="5" />`)
      expect(InputB).toReturnWith(`<input id="stateB" value="20" size="5" />`)
      expect(Calculator).toReturnWith(`<p>a + b = 120</p>`)
      expect(App).toReturnWith(`<input id="stateA" value="100" size="5" /><br /><input id="stateB" value="20" size="5" /><br /><p>a + b = 120</p>`)

      store.commit('SET_B', 200);

      expect(InputA).toBeCalledTimes(5);
      expect(InputB).toBeCalledTimes(5);
      expect(Calculator).toBeCalledTimes(6);
      expect(App).toBeCalledTimes(3);

      expect(InputA).toReturnWith(`<input id="stateA" value="100" size="5" />`)
      expect(InputB).toReturnWith(`<input id="stateB" value="200" size="5" />`)
      expect(Calculator).toReturnWith(`<p>a + b = 300</p>`)
      expect(App).toReturnWith(`<input id="stateA" value="100" size="5" /><br /><input id="stateB" value="200" size="5" /><br /><p>a + b = 300</p>`)
    })
  })
})
