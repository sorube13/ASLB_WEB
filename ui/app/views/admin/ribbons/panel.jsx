import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import moment from 'moment';
import userHelper from 'focus-core/user';
import confirm from 'focus-core/application/confirm';
import Ribbon from '../../../components/ribbon';
export default React.createClass({
    displayName: 'PartenairePanel',
    getInitialState() {
        return {}
    },
    /** @inheritDoc */
    renderActionsEdit() {
        if (!this.props.hideButtons) {
            return <div>
                <Button type='button' label='button.edit' handleOnClick={() => {this.props.editAction(this.props.value)}}/>
                <Button type='button' label='button.remove' handleOnClick={() => {
                    confirm(i18n.t('confirmDelete.presentation')).then(
                        () => {this.props.deleteAction(this.props.value)}
                    )}}/>
            </div>
        }
    },
    render() {
        return (
        <div data-focus='panel-into-panel'>
            <div data-focus='presentation-personne'>
                    <div data-focus='title'>
                        {this.renderActionsEdit()}
                    </div>
                    <Ribbon {...this.props.value} />
                </div>     
        </div>
        );
    }
});
