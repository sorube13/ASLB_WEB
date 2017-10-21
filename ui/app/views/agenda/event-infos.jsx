import React from 'react';
import Calendar from './calendar';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import agendaServices from '../../services/agenda';
import moment from 'moment';
import userHelper from 'focus-core/user';
import confirm from 'focus-core/application/confirm';

export default React.createClass({
    displayName: 'HomeView',
    mixins: [formMixin],
    definitionPath: 'event',
    componentWillMount() {
        this.setState({});

    },
    getInitialState() {
        return {...this.props.event, date_debut : moment(this.props.event.date_debut)};
    },
    addSelf() {
        if (this.validate()) {
            agendaServices.addSelfToEvent(this.props.event).then(this.props.onPopinClose);
            //request.execute(function(event) {that.props.onPopinClose()})
        }
    },
    removeSelf() {
        if (this.validate()) {
            agendaServices.removeSelfToEvent(this.props.event).then(this.props.onPopinClose);
            //request.execute(function(event) {that.props.onPopinClose()})
        }
    },
    deleteEvent() {
        confirm(i18n.t('event.deleteEventConfirm')).then(() => agendaServices.deleteEvent(this.props.event).then(this.props.onPopinClose));
            //request.execute(function(event) {that.props.onPopinClose()})
    },
    isInEvent(id) {
        for (let index in this.props.event.participants) {
            if (this.props.event.participants[index]._id === id) {
                return true;
            }
        }
        return false;
    },
    isOwner() {
        return userHelper.getLogin() && this.props.event.createur._id === userHelper.getLogin()._id;
    },
    update() {
        agendaServices.updateEvent(this._getEntity());
        this.setState({...this._getEntity(),isEdit: !this.state.isEdit});
    },
    renderActionsUpdate() {
        if (this.state.isEdit) {
            return <Button label='button.save' type='button' handleOnClick={this.update} />
        } else {
            return <Button label='button.edit' type='button' handleOnClick={ () => this.setState({isEdit: !this.state.isEdit})} />;
        }
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            <Panel title='agenda.evenementDetail' actions={this.isOwner() && this.renderActionsUpdate}>
                {this.fieldFor('name')}
                {this.fieldFor('created', {value: this.state.created_date, isEdit: false})}
                {this.fieldFor('creator', {value: this.state.createur && (this.state.createur.prenom + ' ' + this.state.createur.nom), isEdit: false})}
                {this.fieldFor('date_debut')}
                {this.fieldFor('duree')}
                {this.fieldFor('limite')}
                {this.fieldFor('description', {value: this.state.description})}
                {userHelper.getLogin() && !this.isInEvent(userHelper.getLogin()._id) && <div>
                    <Button label='event.addSelf' type='button' handleOnClick={this.addSelf} />
                </div>}
                {userHelper.getLogin() && this.isInEvent(userHelper.getLogin()._id) && <div>
                    <Button label='event.removeSelf' type='button' handleOnClick={this.removeSelf} />
                </div>}
                {this.isOwner() && <div>
                    <Button label='event.deleteEvent' type='button' handleOnClick={this.deleteEvent} />
                </div>}
            </Panel>
        </div>
        );
    }
});