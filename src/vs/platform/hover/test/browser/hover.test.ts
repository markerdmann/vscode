import * as assert from 'assert';
import { Disposable } from 'vs/base/common/lifecycle';
import { IMarkdownString } from 'vs/base/common/htmlContent';
import { IHoverAction, HoverWidget } from 'vs/platform/hover/browser/hover';

suite('Hover', () => {

  test('HoverWidget renders element and actions', () => {
    const hoverElement = document.createElement('div');
    const actionsElement = document.createElement('div');
    const actions: IHoverAction[] = [{
      label: 'Action 1',
      commandId: 'action1',
      run: () => {}
    }];
    
    const widget = new HoverWidget(hoverElement, actionsElement, actions, new Disposable());
    
    assert.strictEqual(hoverElement.innerHTML, '');
    assert.strictEqual(actionsElement.children.length, 1);
    assert.strictEqual(actionsElement.children[0].textContent, 'Action 1');
  });

  test('HoverWidget calls onDispose when disposed', () => {
    const onDisposeSpy = sinon.spy();
    const widget = new HoverWidget(document.createElement('div'), document.createElement('div'), [], Disposable.create(onDisposeSpy));

    assert.ok(!onDisposeSpy.called);
    widget.dispose();
    assert.ok(onDisposeSpy.called);
  });

  // Add more tests here to cover other methods and behaviors...
});