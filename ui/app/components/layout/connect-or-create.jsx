import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import moment from 'moment';
import userHelper from 'focus-core/user';
import userServices from '../../services/user';
import {component as Popin} from 'focus-components/application/popin';
import message from 'focus-core/message';

export default React.createClass({
    displayName: 'HomeView',
    mixins: [formMixin],
    definitionPath: 'person',
    componentWillMount() {
        
    },
    getInitialState() {
        return {connect: true};
    },
    connect() {
        if (this._validate()) {
            userServices.connect(this._getEntity()).then((res) => {
                userHelper.setLogin({...userHelper.getLogin(), ...res});
                document.cookie = "tokenJWT=" + res.token;
                window.location.reload();
            }, err => { console.log(err); throw err;});
        }
    },
    create() {
        if (this._validate()) {
            userServices.create(this._getEntity()).then(() => {message.addSuccessMessage(i18n.t('person.createdSuccess'))}, err => { console.log(err); throw err;});
        }
    },
    customValidation() {
        if (!this.state.connect) {
            if (this._getEntity().password !== this._getEntity().passwordAgain) {
                this.refs['person.password'].setError(i18n.t('person.badPasswords'));
                this.refs['person.passwordAgain'].setError(i18n.t('person.badPasswords'));
            }
        }
        return true;
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            <div data-scope='button-bar-compte'>
            <Button label='user.connect' className={this.state.connect ? 'active' : ''} type='button' handleOnClick={() => {this.setState({connect: true})} } />
            <Button label='user.create' className={this.state.connect ? '' : 'active'} type='button' handleOnClick={() => {this.setState({connect: false})} } />
            </div>
            {this.fieldFor('email', {isEdit: true})}
            {this.fieldFor('password', {isEdit: true})}
            {!this.state.connect && this.fieldFor('passwordAgain', {isEdit: true})}
            {!this.state.connect && this.fieldFor('prenom', {isEdit: true})}
            {!this.state.connect && this.fieldFor('nom', {isEdit: true})}
            {this.state.connect && <Button label='user.connexion' type='button' handleOnClick={this.connect} />}
            {!this.state.connect && <Button label='user.creation' type='button' handleOnClick={this.create} />}
        </div>
        );
    }
});