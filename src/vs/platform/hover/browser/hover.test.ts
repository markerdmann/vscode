import { assert } from 'chai';
import { mock, instance, when, verify } from 'ts-mockito';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IHoverService } from 'vs/platform/hover/browser/hover';
import { WorkbenchHoverDelegate } from 'vs/platform/hover/browser/hover';
import { DisposableStore } from 'vs/base/common/lifecycle';
import { KeyCode } from 'vs/base/common/keyCodes';

describe('WorkbenchHoverDelegate', () => {
    let configurationService: IConfigurationService;
    let hoverService: IHoverService;
    let hoverDelegate: WorkbenchHoverDelegate;

    beforeEach(() => {
        configurationService = mock(IConfigurationService);
        hoverService = mock(IHoverService);
        hoverDelegate = new WorkbenchHoverDelegate(
            'mouse',
            true,
            {},
            instance(configurationService),
            instance(hoverService)
        );
    });

    it('should show hover with correct options', () => {
        const options = { target: document.createElement('div'), content: 'test' };
        hoverDelegate.showHover(options);
        verify(hoverService.showHover(options, undefined)).once();
    });

    it('should return correct delay for instant hovering', () => {
        hoverDelegate['lastHoverHideTime'] = Date.now();
        assert.equal(hoverDelegate.delay, 0);
    });

    it('should set instant hover time limit', () => {
        hoverDelegate.setInstantHoverTimeLimit(300);
        assert.equal(hoverDelegate['timeLimit'], 300);
    });

    it('should handle hover hide correctly', () => {
        hoverDelegate.onDidHideHover();
        assert.isAbove(hoverDelegate['lastHoverHideTime'], 0);
    });

    it('should not show hover if instantHover is false', () => {
        hoverDelegate = new WorkbenchHoverDelegate(
            'mouse',
            false,
            {},
            instance(configurationService),
            instance(hoverService)
        );
        const options = { target: document.createElement('div'), content: 'test' };
        hoverDelegate.showHover(options);
        verify(hoverService.showHover(options, undefined)).never();
    });
});