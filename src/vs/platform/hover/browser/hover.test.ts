import { assert } from 'chai';
import { mock, instance, when, verify } from 'ts-mockito';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IHoverService, WorkbenchHoverDelegate } from 'vs/platform/hover/browser/hover';
import { IHoverDelegateOptions } from 'vs/base/browser/ui/hover/hoverDelegate';
import { KeyCode } from 'vs/base/common/keyCodes';

describe('WorkbenchHoverDelegate', () => {
    let configurationService: IConfigurationService;
    let hoverService: IHoverService;
    let workbenchHoverDelegate: WorkbenchHoverDelegate;

    beforeEach(() => {
        configurationService = mock(IConfigurationService);
        hoverService = mock(IHoverService);
        workbenchHoverDelegate = new WorkbenchHoverDelegate(
            'mouse',
            true,
            {},
            instance(configurationService),
            instance(hoverService)
        );
    });

    it('should initialize with default values', () => {
        assert.equal(workbenchHoverDelegate['lastHoverHideTime'], 0);
        assert.equal(workbenchHoverDelegate['timeLimit'], 200);
    });

    it('should return correct delay value', () => {
        when(configurationService.getValue<number>('workbench.hover.delay')).thenReturn(300);
        assert.equal(workbenchHoverDelegate.delay, 300);
    });

    it('should show hover with correct options', () => {
        const options: IHoverDelegateOptions = {
            target: document.createElement('div'),
            content: 'Test Content'
        };
        workbenchHoverDelegate.showHover(options);
        verify(hoverService.showHover(options, undefined)).once();
    });

    it('should hide hover on escape key press', () => {
        const target = document.createElement('div');
        const options: IHoverDelegateOptions = { target, content: 'Test Content' };
        workbenchHoverDelegate.showHover(options);
        const event = new KeyboardEvent('keydown', { keyCode: KeyCode.Escape });
        target.dispatchEvent(event);
        verify(hoverService.hideHover()).once();
    });

    it('should set instant hover time limit', () => {
        workbenchHoverDelegate.setInstantHoverTimeLimit(500);
        assert.equal(workbenchHoverDelegate['timeLimit'], 500);
    });

    it('should throw error if instant hover is not enabled', () => {
        workbenchHoverDelegate = new WorkbenchHoverDelegate(
            'mouse',
            false,
            {},
            instance(configurationService),
            instance(hoverService)
        );
        assert.throws(() => workbenchHoverDelegate.setInstantHoverTimeLimit(500), 'Instant hover is not enabled');
    });

    it('should update lastHoverHideTime on hide', () => {
        const beforeHideTime = Date.now();
        workbenchHoverDelegate.onDidHideHover();
        assert.isAbove(workbenchHoverDelegate['lastHoverHideTime'], beforeHideTime);
    });
});