import React, { PureComponent } from 'react';

import MissionCost from './missioncost';
import { EquipmentItemSource } from '../model/equipment';
import { Link } from 'gatsby';
import CONFIG from './CONFIG';
import { TinyStore } from '../utils/tiny';

type ItemSourcesProps = {
	item_sources: EquipmentItemSource[];
	brief?: boolean;
	refItem?: string;
	pageId?: string;
	briefLength?: number;
};

interface ItemSourcesState {
	briefs: {
		dispute: boolean;
		battle: boolean;
		faction: boolean;
		cadet: boolean;
	}
}

class ItemSources extends PureComponent<ItemSourcesProps, ItemSourcesState> {
	private readonly tiny: TinyStore;

	constructor(props: ItemSourcesProps) {
		super(props);
		this.tiny = TinyStore.getStore((props.pageId ? props.pageId + "_" : "") + 'itemsources', true);

		const defstate = {
			briefs: {
				dispute: true,
				battle: true,
				faction: true,
				cadet: true
			}
		} as ItemSourcesState;
		this.state = this.tiny.getValue<ItemSourcesState>('whole_state', defstate) ?? defstate;
	}

	private readonly setBrief = (name: 'dispute' | 'battle' | 'faction' | 'cadet', value: boolean) => {
		const newstate = JSON.parse(JSON.stringify(this.state)) as ItemSourcesState;
		newstate.briefs[name] = value;
		this.tiny.setValue('whole_state', newstate);
		window.setTimeout(() => {
			this.setState({ ... newstate });
		})
		
	}

	private readonly getBrief = (name: 'dispute' | 'battle' | 'faction' | 'cadet') => {
		return this.state.briefs[name];
	}

	render() {
		let disputeMissions = this.props.item_sources.filter(e => e.type === 0);
		let shipBattles = this.props.item_sources.filter(e => e.type === 2);
		let factions = this.props.item_sources.filter(e => e.type === 1);
		let cadets = this.props.item_sources.filter(e => e.type === 4);
		const { brief, refItem } = this.props;
		const briefLen = this.props.briefLength ?? 2;
		const briefSep = <>, </>;
		const briefSepInit = <>&nbsp;</>;
		const briefSepFinal = <><br /></>;
		const textDec = "";
		let res = [] as JSX.Element[];
		if (disputeMissions.length > 0) {
			const isBriefed = this.getBrief('dispute');

			res.push(
				<p key={'disputeMissions'}>
					<b style={{textDecoration: brief ? textDec : undefined}}>Missions: </b>{brief && <>{briefSepInit}</>}
					{disputeMissions
						.slice(0, (brief && isBriefed) ? briefLen : undefined)
						.map((entry, idx) => (
							<MissionCost
								key={idx}
								mission_symbol={entry.mission_symbol}
								cost={entry.cost ?? 0}
								avg_cost={entry.avg_cost}
								name={entry.name}
								chance_grade={entry.chance_grade}
								mastery={entry.mastery ?? 0}
							/>
						))
						.reduce((prev, curr) => <>{prev}{brief && <>{briefSep}</> || <>{', '}</>}{curr}</>)}
					{refItem && brief && isBriefed && disputeMissions.length > briefLen && <><>{briefSepFinal}</><a style={{cursor: "pointer"}} onClick={(e) => this.setBrief('dispute', false)}>(Show {disputeMissions.length - briefLen} more ...)</a></>}	
					{refItem && brief && !isBriefed && disputeMissions.length > briefLen && <><>{briefSepFinal}</><a style={{cursor: "pointer"}} onClick={(e) => this.setBrief('dispute', true)}>(Show less)</a></>}	
				</p>
			);
		}

		if (shipBattles.length > 0) {
			const isBriefed = this.getBrief('battle');

			res.push(
				<p key={'shipBattles'}>
					<b style={{textDecoration: brief ? textDec : undefined}}>Ship battles: </b>{brief && <>{briefSepInit}</>}
					{shipBattles
						.slice(0, (brief && isBriefed) ? briefLen : undefined)
						.map((entry, idx) => (
							<MissionCost
								key={idx}
								mission_symbol={entry.mission_symbol}
								cost={entry.cost ?? 0}
								avg_cost={entry.avg_cost}
								name={entry.name}
								chance_grade={entry.chance_grade}
								mastery={entry.mastery ?? 0}
							/>
						))
						.reduce((prev, curr) => <>{prev}{brief && <>{briefSep}</> || <>{', '}</>}{curr}</>)}
					{refItem && brief && isBriefed && shipBattles.length > briefLen && <><>{briefSepFinal}</><a style={{cursor: "pointer"}} onClick={(e) => this.setBrief('battle', false)}>(Show {shipBattles.length - briefLen} more ...)</a></>}	
					{refItem && brief && !isBriefed && shipBattles.length > briefLen && <><>{briefSepFinal}</><a style={{cursor: "pointer"}} onClick={(e) => this.setBrief('battle', true)}>(Show less)</a></>}	
				</p>
			);
		}

		if (factions.length > 0) {
			const isBriefed = this.getBrief('faction');

			res.push(
				<p key={'factions'}>
					<b style={{textDecoration: brief ? textDec : undefined}}>Faction missions: </b>{brief && <>{briefSepInit}</>}
					{factions
						.slice(0, (brief && isBriefed) ? briefLen : undefined)
						.map((entry, idx) => <>{`${entry.name} (${entry.chance_grade}/5)`}</>)
						.reduce((prev, curr) => <>{prev}{brief && <>{briefSep}</> || <>{', '}</>}{curr}</>)}
					{refItem && brief && isBriefed && factions.length > briefLen && <><>{briefSepFinal}</><a style={{cursor: "pointer"}} onClick={(e) => this.setBrief('faction', false)}>(Show {factions.length - briefLen} more ...)</a></>}	
					{refItem && brief && !isBriefed && factions.length > briefLen && <><>{briefSepFinal}</><a style={{cursor: "pointer"}} onClick={(e) => this.setBrief('faction', true)}>(Show less)</a></>}	
				</p>
			);
		}
		if (cadets.length > 0) {
			const isBriefed = this.getBrief('cadet');

			cadets.sort((a, b) => (a.avg_cost ?? 0) - (b.avg_cost ?? 0));
			res.push(
				<p key={'disputeMissions'}>
					<b style={{textDecoration: brief ? textDec : undefined}}>Cadet challenges: </b>{brief && <>{briefSepInit}</>}
					{cadets
						.slice(0, (brief && isBriefed) ? briefLen : undefined)
						.map((entry, idx) => (
							<MissionCost
								cadet={true}
								key={idx}
								mission_symbol={entry.mission_symbol}
								cost={entry.cost ?? 0}
								avg_cost={entry.avg_cost}
								name={`${entry.cadet_mission}: ${entry.name}`}
								chance_grade={entry.chance_grade}
								mastery={entry.mastery ?? 0}
							/>
						))
						.reduce((prev, curr) => <>{prev}{brief && <>{briefSep}</> || <>{', '}</>}{curr}</>)}
					{refItem && brief && isBriefed && cadets.length > briefLen && <><>{briefSepFinal}</><a style={{cursor: "pointer"}} onClick={(e) => this.setBrief('cadet', false)}>(Show {cadets.length - briefLen} more ...)</a></>}	
					{refItem && brief && !isBriefed && cadets.length > briefLen && <><>{briefSepFinal}</><a style={{cursor: "pointer"}} onClick={(e) => this.setBrief('cadet', true)}>(Show less)</a></>}	
				</p>
			);
		}
		

		return res;
	}
}

export default ItemSources;