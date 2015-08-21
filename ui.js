$(function() {
	var units = {
		soldier: "<h1>Soldier</h1><p>Simple close combat unit. Can use shield.</p><p><b>Health:</b> 200 | <b>Damage:</b> 20</p><p><i>Note: soldier will rise shield with 70% chance. If shield raised up - incoming damage reduced to 1/4 from the original.</i></p>",
		berserker: "<h1>Berserker</h1><p>Invulnerable to magic and have rage state which double his damage.<p><b>Health:</b> 230 | <b>Damage:</b> 30</p></p><p><i>Note: when rage state is turned on, it can't be turned off.",
		rogue: "<h1>Rogue</h1><p>Can evade attacks and when he attacking, units do not counterattacks him.<p><b>Health:</b> 175 | <b>Damage:</b> 30</p></p><p><i>Note: evade chance - 30%. If rogue evaded attack, he receives no damage.",
		archer: "<h1>Archer</h1><p>Simple range unit. <p><b>Health:</b> 175 | <b>Damage:</b> 50</p></p>",
		werewolf: "<h1>Werewolf</h1><p>Close combat unit with two states - human and wolf. In wolf state have more hit points and damage. Can infect other units (excluding Demon and Vampire) and make them a werewolf to.</p><p><b>Health:</b> 150 | <b>Damage:</b> 15</p><p><i>Note: werewolf can transform in the begining of each turn with 50% chance. If he have to low hp for transforming - he will die.</i></p>",
		vampire: "<h1>Vampire</h1><p>Undead close combat unit. Heals himself when attacking or counterattacking. Infects other units.</p><p><b>Health:</b> 200 | <b>Damage:</b> 25</p><p><i>Note: vampirism heals vampire on 1/4 from damage every hit.</i></p>",
		demon: "<h1>Demon</h1><p>Strong close combat unit. Can cover his master from attacks.</p><p><b>Health:</b> 250 | <b>Damage:</b> 50</p><p><i>Note: can't be infected. Demon always standing near his master and attacking only when his master told him so. Not displayed on the map.</i></p>",
		wizard: "<h1>Wizard</h1><p>Standard battle mage. Attacking and counterattacking with spells.</p><p><b>Health:</b> 150 | <b>Mana:</b> 200 | <b>Damage:</b> 10</p><p><i>Note: healing twice weaker. Like other mages, heals himself every turn if have enough mana. Have mana regeneration in amount of 10 mp/turn.</i></p>",
		healer: "<h1>Healer</h1><p>Standard support mage. Attacking and counterattacking with spells. Battle spells twice weaker.</p><p><b>Health:</b> 130 | <b>Mana:</b> 300 | <b>Damage:</b> 10</p><p><i>Note: battle spells twice weaker. Like other mages, heals himself every turn if have enough mana. Have mana regeneration in amount of 10 mp/turn.</i></p>",
		priest: "<h1>Priest</h1><p>Support mage. Attacking and counterattacking with spells. Healing deals damage to undead units with double damage.</p><p><b>Health:</b> 160 | <b>Mana:</b> 300 | <b>Damage:</b> 15</p><p><i>Note: battle spells twice weaker. Like other mages, heals himself every turn if have enough mana. Have mana regeneration in amount of 10 mp/turn.</i></p>",
		warlock: "<h1>Warlock</h1><p>Battle mage. Attacking and counterattacking with spells. Can summon Demon.<p><b>Health:</b> 170 | <b>Mana:</b> 150 | <b>Damage:</b> 15</p></p><p><i>Note: healing spells twice weaker. Like other mages, heals himself every turn if have enough mana. Have mana regeneration in amount of 10 mp/turn. Demon can cover his master with 30% chance. If this happens - warlock have no damage from attack. In close combat warlock always use demon.</i></p>",
		necromancer: "<h1>Necromancer</h1><p>Battle mage. Heal himself when his target dying.</p><p><b>Health:</b> 200 | <b>Mana:</b> 200 | <b>Damage:</b> 20</p><p><i>Note: healing spells twice weaker. Like other mages, heals himself every turn if have enough mana. Have mana regeneration in amount of 10 mp/turn. Dying target gives necromancer 1/3 from maximum of health points.</i></p>"
	};

	var abilities = {
		evading: "<h1>Evading</h1><p>Ability of the Rogue. Allows rogue to evade attacks without taking damage. When ability triggers, rogue moves to the random cell nearby with his enemy. Working when somebody trying to attack rogue.</p><p><b>Chance:</b> 30% </p>",
		shield: "<h1>Hide behind a shield</h1><p>Ability of the Soldier. Reduces incoming damage from magic and physic attack. Working when somebody trying to attack soldier.</p><p><b>Chance:</b> 70%</p>",
		transform: "<h1>Transformation</h1><p>Ability of the Werewolf. Allows transform werewolf in to wolf or in to human. In wolf form werewolf have double health and damage. The werewolf tries to use the ability at the beginning of each turn.</p><p><b>Chance:</b> 70%</p>",
		vampirism: "<h1>Vampirism</h1><p>Ability of the Vampire. Allows the vampire to be treated during the attack. Healing amount - 1/4 of damage.</p><p><b>Chance:</b> always</p>",
	};

	var spells = {
		fireball: "<h1>Fireball</h1><p>Fire from the sky! And rock... maybe.</p><p><b>Damage:</b> 50 | <b>Mana cost:</b> 40</p>",
		healing: "<h1>Healing</h1><p>Healing... heals.</p><p><b>Effect:</b> 60 | <b>Mana cost:</b> 30</p>"
	};

	var unitsOutput = "", abilitiesOutput = "", spellsOutput = "";

	for (var value in units) {
		unitsOutput += '<p id="'+ value + '">' + value.slice(0,1).toUpperCase() + value.slice(1) + '</p>';
	}

	for (var value in abilities) {
		abilitiesOutput += '<p id="'+ value + '">' + value.slice(0,1).toUpperCase() + value.slice(1) + '</p>';
	}

	for (var value in spells) {
		spellsOutput += '<p id="'+ value + '">' + value.slice(0,1).toUpperCase() + value.slice(1) + '</p>';
	}

	$("#units").click(function() {
		$("#list").html(unitsOutput);
	});

	$("#abilities").click(function() {
		$("#list").html(abilitiesOutput);
	});

	$("#spells").click(function() {
		$("#list").html(spellsOutput);
	});

	$("body").on("mouseenter", "#soldier", function () {
		$("#info").html(units.soldier);
	});	

	$("body").on("mouseenter", "#berserker", function () {
		$("#info").html(units.berserker);
	});	

	$("body").on("mouseenter", "#rogue", function () {
		$("#info").html(units.rogue);
	});	

	$("body").on("mouseenter", "#archer", function () {
		$("#info").html(units.archer);
	});	

	$("body").on("mouseenter", "#werewolf", function () {
		$("#info").html(units.werewolf);
	});	

	$("body").on("mouseenter", "#vampire", function () {
		$("#info").html(units.vampire);
	});	

	$("body").on("mouseenter", "#demon", function () {
		$("#info").html(units.demon);
	});	

	$("body").on("mouseenter", "#wizard", function () {
		$("#info").html(units.wizard);
	});	

	$("body").on("mouseenter", "#healer", function () {
		$("#info").html(units.healer);
	});	

	$("body").on("mouseenter", "#priest", function () {
		$("#info").html(units.priest);
	});	

	$("body").on("mouseenter", "#warlock", function () {
		$("#info").html(units.warlock);
	});	

	$("body").on("mouseenter", "#necromancer", function () {
		$("#info").html(units.necromancer);
	});	

	$("body").on("mouseenter", "#shield", function () {
		$("#info").html(abilities.shield);
	});	

	$("body").on("mouseenter", "#vampirism", function () {
		$("#info").html(abilities.vampirism);
	});	

	$("body").on("mouseenter", "#transform", function () {
		$("#info").html(abilities.transform);
	});	

	$("body").on("mouseenter", "#evading", function () {
		$("#info").html(abilities.evading);
	});	

	$("body").on("mouseenter", "#fireball", function () {
		$("#info").html(spells.fireball);
	});	

	$("body").on("mouseenter", "#healing", function () {
		$("#info").html(spells.healing);
	});	
})
