import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import adminServices from '../../../services/admin';
import moment from 'moment';
import userHelper from 'focus-core/user';
import confirm from 'focus-core/application/confirm';
import Textarea from 'focus-components/components/input/textarea';
import {translate} from 'focus-core/translation';

const ComponentDesactivation = React.createClass({
    getInitialState() {
        return {raison: ''};
    },
    onRaisonChange(value) {
        this.props.onRaisonChange(value);
        this.setState({raison: value});
    },
    render() {
        return (
        <div data-focus='display-column'>
        <label>{translate(this.props.showComment ? 'person.confirmDesactiver' : 'person.confirmActiver')}</label>
        {this.props.showComment && <Textarea onChange={this.onRaisonChange} value={this.state.raison} />}
        </div>
        );
    }
});

export default React.createClass({
    displayName: 'HomeView',
    mixins: [formMixin],
    definitionPath: 'person',
    componentWillMount() {
    },
    getInitialState() {
        return {...this.props.data, 
            dossier_complet: (this.props.data.dossier_complet === 'Oui'), 
            adhesion: (this.props.data.adhesion === 'Oui'), 
            decharge: (this.props.data.decharge === 'Oui'), 
            reglement: (this.props.data.reglement === 'Oui'), 
            certificat: (this.props.data.certificat === 'Oui'), 
            cotisation: (this.props.data.cotisation === 'Oui'), 
        };
    },
    canCreateToggle() {
        confirm(i18n.t('confirmAddDroits.create')).then( () => {
            adminServices.canCreateToggle({ id: this.state._id}).then(this.props.onPopinClose);
        });
    },
    toggleAdmin() {
        confirm(i18n.t('confirmAddDroits.admin')).then( () => {
            adminServices.toggleAdmin({ id: this.state._id}).then(this.props.onPopinClose);
        });
    },
    update() {
        adminServices.updateUser({...this._getEntity(),id: this.state._id, avatar: undefined}).then(this.props.onPopinClose);
        this.setState({...this._getEntity(),isEdit: !this.state.isEdit});
    },
    renderActionsUpdate() {
        if (this.state.isEdit) {
            return <Button label='button.save' type='button' handleOnClick={this.update} />
        } else {
            return <Button label='button.edit' type='button' handleOnClick={ () => this.setState({isEdit: !this.state.isEdit})} />;
        }
    },
    computeDateFin(dateAdhesion) {
        var momentFin = moment('31/08/2018','DD/MM/YYYY');
        var momentDebut = moment(dateAdhesion, [moment.ISO_8601,'DD/MM/YYYY', 'DDMMYYYY']);
        if (momentDebut.isValid()) {
            momentFin.set('year', momentDebut.get('year'));
            if (momentFin.isBefore(momentDebut)) {
                momentFin.set('year', momentFin.get('year') +1);
            }
            if (momentFin.get('year') === 2018) {
                momentFin.set('year', momentFin.get('year') +1);
            }
            return  momentFin;
            //this.setState({date_fin: momentFin, date_activation: dateAdhesion});
        }
        
    },
    onRaisonChange(value) {
        this.state.raisonChange = value;
    },
    toggleActif() {
        confirm(() => <ComponentDesactivation showComment={this.state.actif} onRaisonChange={this.onRaisonChange} /> ).then( () => {
            adminServices.toggleActif({ id: this.state._id, raison: this.state.raisonChange}).then(this.props.onPopinClose);
        });
    },
    onChangeInfo(field) {
        let that = this;
        return (value) => {
            let data = that._getEntity();
            data[field] = value;
            if (data.adhesion && data.decharge && data.reglement && data.certificat && data.cotisation) {
                data.dossier_complet = true;
                data.date_activation = moment();
                data.date_fin = this.computeDateFin(moment());
            } else {
                data.dossier_complet = false;
                data.date_activation = undefined;
                data.date_fin = undefined;
            }
            that.setState(data);
        }
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            <Panel title='admin.personDetail' actions={this.renderActionsUpdate}>
                {this.fieldFor('nom')}
                {this.fieldFor('prenom')}
                {this.fieldFor('email')}
                {this.fieldFor('dateNaissance')}
                {this.fieldFor('telephone')}
                {this.fieldFor('numero', {isEdit: false})}
                {this.fieldFor('date_activation', {isEdit: false})}
                {this.fieldFor('date_fin', {isEdit: false})}
                {this.fieldFor('dossier_complet', {isEdit: false})}
                {this.fieldFor('adhesion', {onChange: this.onChangeInfo('adhesion')})}
                {this.fieldFor('decharge', {onChange: this.onChangeInfo('decharge')})}
                {this.fieldFor('reglement', {onChange: this.onChangeInfo('reglement')})}
                {this.fieldFor('certificat', {onChange: this.onChangeInfo('certificat')})}
                {this.fieldFor('cotisation', {onChange: this.onChangeInfo('cotisation')})}
                {this.fieldFor('canCreate', {isEdit: false})}
                {this.fieldFor('isAdmin', {isEdit: false})}
                {this.fieldFor('tokens')}

                <div>  
                    <Button label='person.toggleCanCreate' type='button' handleOnClick={this.canCreateToggle} />
                    <Button label='person.setAdmin' type='button' handleOnClick={this.toggleAdmin} />
                    <Button label={this.state.actif ? 'person.inactiver' : 'person.activer'} type='button' handleOnClick={this.toggleActif} />
                </div>
            </Panel>
        </div>
        );
    }
});
