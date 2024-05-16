import { assert } from 'chai';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IHoverService, WorkbenchHoverDelegate } from 'vs/platform/hover/browser/hover';
import { DisposableStore } from 'vs/base/common/lifecycle';
import { KeyCode } from 'vs/base/common/keyCodes';
import { IHoverDelegateOptions } from 'vs/base/browser/ui/hover/hoverDelegate';
import { IHoverWidget } from 'vs/base/browser/ui/hover/hover';
import { mock } from 'ts-mockito';

suite('WorkbenchHoverDelegate', () => {
    let configurationService: IConfigurationService;
    let hoverService: IHoverService;
    let hoverDelegate: WorkbenchHoverDelegate;
    let disposables: DisposableStore;

    setup(() => {
        configurationService = mock<IConfigurationService>();
        hoverService = mock<IHoverService>();
        disposables = new DisposableStore();
        hoverDelegate = new WorkbenchHoverDelegate('mouse', true, {}, configurationService, hoverService);
    });

    teardown(() => {
        disposables.clear();
    });

    test('should initialize with correct delay from configuration', () => {
        assert.equal(hoverDelegate.delay, 200);
    });

    test('should show hover instantly if recently hidden', () => {
        hoverDelegate.onDidHideHover();
        assert.isTrue(hoverDelegate.isInstantlyHovering());
    });

    test('should not show hover instantly if not recently hidden', (done) => {
        setTimeout(() => {
            assert.isFalse(hoverDelegate.isInstantlyHovering());
            done();
        }, 300);
    });

    test('should set instant hover time limit', () => {
        hoverDelegate.setInstantHoverTimeLimit(500);
        assert.equal(hoverDelegate['timeLimit'], 500);
    });

    test('should throw error if setting instant hover time limit when instant hover is disabled', () => {
        hoverDelegate = new WorkbenchHoverDelegate('mouse', false, {}, configurationService, hoverService);
        assert.throws(() => hoverDelegate.setInstantHoverTimeLimit(500), 'Instant hover is not enabled');
    });

    test('should show hover with correct options', () => {
        const options: IHoverDelegateOptions = {
            target: document.createElement('div'),
            content: 'Test Content'
        };
        const hoverWidget = hoverDelegate.showHover(options);
        assert.isDefined(hoverWidget);
    });

    test('should hide hover on escape key press', () => {
        const options: IHoverDelegateOptions = {
            target: document.createElement('div'),
            content: 'Test Content'
        };
        hoverDelegate.showHover(options);
        const event = new KeyboardEvent('keydown', { keyCode: KeyCode.Escape });
        document.dispatchEvent(event);
        assert.isFalse(hoverDelegate.isInstantlyHovering());
    });
});