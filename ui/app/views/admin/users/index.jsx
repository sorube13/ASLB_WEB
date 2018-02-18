import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import React from 'react';
import { navigate, views } from 'react-big-calendar/lib/utils/constants';
import fetch from '../../../utils/fetch';
import {mixin as formMixin} from 'focus-components/common/form';
import builder from 'focus-core/util/url/builder';
import {component as Popin} from 'focus-components/application/popin';
import adminServices from '../../../services/admin';
import userHelper from 'focus-core/user';
import {component as Button} from 'focus-components/common/button/action';
import Toggle from 'focus-components/components/input/toggle';
import Panel from 'focus-components/components/panel';
import Input from 'focus-components/components/input/text';
import UserInfo from './user-info';
import UserRibbon from './user-ribbon';
import {downloadCSV} from '../../../utils/download';
import userServices from '../../../services/user';
import message from 'focus-core/message';

export default React.createClass({
    displayName: 'UsersView',
    mixins: [formMixin],
    definitionPath: 'admin',
    referenceNames: ['typeSexe', 'typeEntreprise'],
    getInitialState() {
        return {
            limit: 3,
            filter: ''
        }
    },
    componentWillMount() {
        this.loadAllUsers();
    },
    loadAllUsers() {
        adminServices.loadAllUsers({filter: this.state.filter}).then(res => {this.setState({users: res})});
    },
    export() {
        adminServices.exportAllUsers({filter: this.state.filter}).then(res => {downloadCSV(res, 'users.csv')});;
    },
    openPopin(user) {
        this.setState({selectedUser : user});
    },
    closePopin() {
        this.setState({selectedUser : undefined});
        this.loadAllUsers();
    },
    openPopinRibbon(user) {
        this.setState({selectedUserRibbon : user});
    },
    closePopinRibbon() {
        this.setState({selectedUserRibbon : undefined});
        this.loadAllUsers();
    },
    renderActionsEdit() {
        if (!this.props.hideButtons) {
            return <div>
                <Button type='button' label='button.createUser' handleOnClick={this.createUser} />
                <Button type='button' label='button.exporter' handleOnClick={this.export} />
                <Button type='button' label='button.voirPlus' handleOnClick={() => {this.setState({limit: this.state.limit+3})}}/>
            </div>
        }
    },
    createUser() {
        this.setState({createUser: true});
    },
    closePopinCreate() {
        this.setState({createUser: false});
    },
    onChangeInput(value) {
        this.setState({filter: value}, this.loadAllUsers);
    },
    create() {
        if (this._validate()) {
            userServices.createFromAdmin(this._getEntity()).then(() => {message.addSuccessMessage(i18n.t('person.createdSuccess2'))}, err => { console.log(err); throw err;});
        }
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <Panel  title='Utilisateurs' actions={this.renderActionsEdit}>
            <Input placeholder='Tapez votre recherche' value={this.state.filter} onChange={this.onChangeInput} />
            <div data-focus='user-list'>
                <div data-focus='user-line'>
                    <div>
                        Nom
                    </div>
                    <div>E-mail</div>
                    <div>Numéro d'adhérent</div>
                    <div>Sexe</div>
                    <div>Entreprise</div>
                    <div>Date de début d'adhésion</div>
                    <div>Date de fin d'adhésion</div>
                    <div>Dossier complet</div>
                    <div>Adhésion</div>
                    <div>Décharge</div>
                    <div>Règlement</div>
                    <div>Certificat</div>
                    <div>Côtisation</div>
                    <div>Nombre d'inscriptions dans les 30 derniers jours</div>
                    <div></div>
                </div>
                {this.state.users && this.state.users.length > 0 && this.state.users.map((value, pos) => {
                    if (pos < this.state.limit) {
                        return <div data-focus='user-line'>
                            <div>
                                <div>{value.nom + ' ' + value.prenom}</div>
                                {value.canCreate && <i className='material-icons' >border_color</i>}
                                {value.isAdmin && <i className='material-icons' >build</i>}
                            </div>
                            <div>{value.email}</div>
                            <div>{value.numero}</div>
                            <div>{value.sexe && value.sexe.label}</div>
                            <div>{value.entreprise && value.entreprise.label}</div>
                            <div>{value.date_activation && moment(value.date_activation, moment.ISO_8601).format('DD/MM/YYYY')}</div>
                            <div>{value.date_fin && moment(value.date_fin, moment.ISO_8601).format('DD/MM/YYYY')}</div>
                            <div>{value.dossier_complet}</div>
                            <div>{value.adhesion}</div>
                            <div>{value.decharge}</div>
                            <div>{value.reglement}</div>
                            <div>{value.certificat}</div>
                            <div>{value.cotisation}</div>
                            <div>{value.nombreInscription}</div>
                            <div><Button type='button' icon='edit' shape='fav' handleOnClick={() => {this.openPopin(value)}}/>
                            <Button type='button' icon='fitness_center' shape='fav' handleOnClick={() => {this.openPopinRibbon(value)}}/></div>
                        </div>
                    }
                })}
            </div>
            {this.state.selectedUser && <Popin open={true} size='medium' onPopinClose={this.closePopin}>
                <UserInfo hasLoad={false} data={this.state.selectedUser} onPopinClose={this.closePopin}/>
            </Popin>}
            {this.state.selectedUserRibbon && <Popin open={true} size='medium' onPopinClose={this.closePopinRibbon}>
                <UserRibbon hasLoad={false} data={this.state.selectedUserRibbon} onPopinClose={this.closePopinRibbon}/>
            </Popin>}
            {this.state.createUser && <Popin open={true} size='medium' onPopinClose={this.closePopinCreate}>
                {this.fieldFor('email', {isEdit: true})}
                {this.fieldFor('prenom', {isEdit: true})}
                {this.fieldFor('nom', {isEdit: true})}
                {this.fieldFor('dateNaissance', {isEdit: true})}
                {this.fieldFor('sexe', {isEdit: true, listName: 'typeSexe', valueKey: '_id', isRequired: true})}
                {this.fieldFor('entreprise', {isEdit: true, listName: 'typeEntreprise', valueKey: '_id', isRequired: true})}
                {this.fieldFor('telephone', {isEdit: true})}
                <Button label='user.creation' type='button' handleOnClick={this.create} />
            </Popin>}
        </Panel>
        );
    }
});
