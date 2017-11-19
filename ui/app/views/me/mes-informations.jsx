import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import userServices from '../../services/user';
import moment from 'moment';
import userHelper from 'focus-core/user';
import message from 'focus-core/message';
import {navigate} from 'focus-core/history';
export default React.createClass({
    displayName: 'MesInformationsView',
    mixins: [formMixin],
    definitionPath: 'person',
    componentWillMount() {
        userServices.loadMesInformations().then(res => {this.setState(res)});
    },
    getInitialState() {
        return {...this.props.data};
    },
    create() {
        if (this.validate()) {
            let data = this._getEntity();
            if (this.state._id) {
                adminServices.editPartenaire({ ...data, id: this.state._id}).then(this.props.onPopinClose);
            } else {
                adminServices.createPartenaire(data).then(this.props.onPopinClose);
            }
        }
    },
    buttonSaveCst() {
        const { isLoading } = this.state;
        const handleOnClick = () => {
            this.clearError();
            if (this._validate()) {
                var emailChanged = this._getEntity().email !== this.state.email;
                userServices.updateMesInformations(this._getEntity()).then((res) => {
                    this.setState({...res, isEdit: false});
                    message.addSuccessMessage(i18n.t('detail.saved'));
                    if (emailChanged) {
                        userServices.disconnect();
                        navigate('/', false);
                        window.location.reload();
                    } else {
                        window.location.reload();
                    }
                });
            }
        };
        return (
            <Button
                handleOnClick={handleOnClick}
                icon='save'
                label='button.save'
                shape={null}
                type='button'
                isLoading={isLoading}
                processLabel='button.saving'
            />
        );
    },
    renderEditActions() {
        return <span>
            {this.buttonSaveCst()}
            {this.buttonCancel()}
        </span>
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            <Panel title='person.mesInformations' actions={this._renderActions}>
                {this.fieldFor('prenom')}
                {this.fieldFor('nom')}
                <label>{i18n.t('person.changeEmailWarning')}</label>
                {this.fieldFor('email')}
            </Panel>
        </div>
        );
    }
});
