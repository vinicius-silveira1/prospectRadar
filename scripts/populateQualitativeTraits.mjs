import 'dotenv/config';
import { supabase } from '../src/lib/supabaseClient.js';

const brazilianProspectsQualitativeTraits = [
  {
    "name": "Reynan Santos",
    "qualitative_traits": {
      "elite_defender": true,
      "athletic_finisher": true,
      "high_motor": true,
      "developing_shooter": true,
      "strong_rebounder_for_position": true,
      "strong_perimeter_defender": true,
      "high_basketball_iq": true,
      "versatile_defender": true,
      "versatile_scorer": true,
      "rim_protector": false,
      "long_wingspan": false,
      "elite_passer": false,
      "tall_playmaker": false,
      "low_athleticism": false,
      "well_rounded": true,
      "improving_shooter": false,
      "solid_defender": false,
      "off_ball_threat": false,
      "high_ft_percentage": false,
      "catch_and_shoot_specialist": false,
      "low_usage_player": false,
      "volume_scorer": false,
      "high_usage_playmaker": false
    }
  },
  {
    "name": "Samis Calderon",
    "qualitative_traits": {
      "elite_defender": true,
      "rim_protector": true,
      "athletic_finisher": true,
      "long_wingspan": true,
      "developing_shooter": true,
      "strong_rebounder_for_position": true,
      "high_motor": true,
      "strong_perimeter_defender": false,
      "elite_passer": false,
      "high_basketball_iq": true,
      "tall_playmaker": false,
      "low_athleticism": false,
      "well_rounded": true,
      "versatile_scorer": false,
      "improving_shooter": false,
      "solid_defender": false,
      "off_ball_threat": true,
      "high_ft_percentage": false,
      "catch_and_shoot_specialist": false,
      "low_usage_player": false,
      "volume_scorer": false,
      "high_usage_playmaker": false,
      "versatile_defender": true,
      "solid_passer": true
    }
  },
  {
    "name": "Gabriel Landeira",
    "qualitative_traits": {
      "elite_passer": true,
      "high_basketball_iq": true,
      "tall_playmaker": true,
      "developing_shooter": true,
      "low_athleticism": true,
      "elite_defender": false,
      "athletic_finisher": false,
      "high_motor": false,
      "strong_rebounder_for_position": false,
      "rim_protector": false,
      "long_wingspan": false,
      "strong_perimeter_defender": true,
      "well_rounded": false,
      "versatile_scorer": false,
      "improving_shooter": true,
      "solid_defender": false,
      "off_ball_threat": false,
      "high_ft_percentage": true,
      "catch_and_shoot_specialist": false,
      "low_usage_player": false,
      "volume_scorer": false,
      "high_usage_playmaker": true
    }
  },
  {
    "name": "Vitor Brandão",
    "qualitative_traits": {
      "well_rounded": true,
      "versatile_scorer": true,
      "improving_shooter": true,
      "solid_defender": true,
      "good_rebounder_for_position": true,
      "high_basketball_iq": true,
      "low_athleticism": true,
      "high_usage_playmaker": true,
      "elite_defender": false,
      "athletic_finisher": false,
      "high_motor": false,
      "developing_shooter": false,
      "strong_rebounder_for_position": false,
      "rim_protector": false,
      "long_wingspan": false,
      "elite_passer": false,
      "tall_playmaker": false,
      "off_ball_threat": false,
      "high_ft_percentage": false,
      "catch_and_shoot_specialist": false,
      "strong_perimeter_defender": false,
      "low_usage_player": false,
      "volume_scorer": false
    }
  },
  {
    "name": "Lucas Atauri",
    "qualitative_traits": {
      "elite_shooter": true,
      "off_ball_threat": true,
      "high_ft_percentage": true,
      "catch_and_shoot_specialist": true,
      "low_athleticism": true,
      "solid_defender": true,
      "strong_perimeter_defender": true,
      "low_usage_player": true,
      "elite_defender": false,
      "athletic_finisher": false,
      "high_motor": false,
      "developing_shooter": false,
      "strong_rebounder_for_position": false,
      "rim_protector": false,
      "long_wingspan": false,
      "elite_passer": false,
      "high_basketball_iq": false,
      "tall_playmaker": false,
      "well_rounded": false,
      "versatile_scorer": false,
      "improving_shooter": false,
      "volume_scorer": false,
      "high_usage_playmaker": false
    }
  },
  {
    "name": "Eduardo Klafke",
    "qualitative_traits": {
      "elite_shooter": true,
      "strong_perimeter_defender": true,
      "catch_and_shoot_specialist": true,
      "low_usage_player": true,
      "elite_defender": true,
      "high_motor": true,
      "long_wingspan": true,
      "high_basketball_iq": true,
      "low_athleticism": true,
      "solid_defender": true,
      "off_ball_threat": true,
      "versatile_defender": true,
      "athletic_finisher": false,
      "developing_shooter": false,
      "strong_rebounder_for_position": false,
      "rim_protector": false,
      "elite_passer": false,
      "tall_playmaker": false,
      "well_rounded": false,
      "versatile_scorer": false,
      "improving_shooter": false,
      "high_ft_percentage": false,
      "volume_scorer": false,
      "high_usage_playmaker": false
    }
  }
];

async function updateProspectsQualitativeTraits() {
  console.log('Iniciando atualização dos traços qualitativos dos prospectos no Supabase...');

  for (const prospectData of brazilianProspectsQualitativeTraits) {
    const { name, qualitative_traits } = prospectData;
    
    try {
      const { data, error } = await supabase
        .from('prospects')
        .update({ qualitative_traits: qualitative_traits })
        .eq('name', name);

      if (error) {
        console.error(`Erro ao atualizar ${name}:`, error.message);
      } else {
        console.log(`Traços qualitativos de ${name} atualizados com sucesso.`);
      }
    } catch (e) {
      console.error(`Exceção ao processar ${name}:`, e.message);
    }
  }
  console.log('Atualização concluída.');
}

updateProspectsQualitativeTraits();
