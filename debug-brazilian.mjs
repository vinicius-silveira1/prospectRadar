// Debug script to check Brazilian prospects in the database
import { supabase } from './src/lib/supabaseClient.js';

async function debugBrazilianProspects() {
  try {
    // Get all prospects to analyze the data structure
    const { data: prospects, error } = await supabase
      .from('prospects')
      .select('name, nationality, country, scope, draft_class')
      .limit(50);

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('=== PROSPECTS DEBUG ===');
    console.log('Total prospects fetched:', prospects.length);
    
    // Check all unique nationalities
    const nationalities = [...new Set(prospects.map(p => p.nationality))].filter(Boolean);
    console.log('All nationalities found:', nationalities);
    
    // Check all unique countries
    const countries = [...new Set(prospects.map(p => p.country))].filter(Boolean);
    console.log('All countries found:', countries);
    
    // Check all unique scopes
    const scopes = [...new Set(prospects.map(p => p.scope))].filter(Boolean);
    console.log('All scopes found:', scopes);
    
    // Look for Brazilian prospects by different criteria
    const byNationalityFlag = prospects.filter(p => p.nationality === '🇧🇷');
    const byNationalityText = prospects.filter(p => p.nationality && p.nationality.toLowerCase().includes('braz'));
    const byCountry = prospects.filter(p => p.country && p.country.toLowerCase().includes('braz'));
    const byScope = prospects.filter(p => p.scope === 'BRAZILIAN_PROSPECTS');
    
    console.log('Brazilian prospects by nationality flag 🇧🇷:', byNationalityFlag.length);
    console.log('Brazilian prospects by nationality text:', byNationalityText.length);
    console.log('Brazilian prospects by country:', byCountry.length);
    console.log('Brazilian prospects by scope:', byScope.length);
    
    if (byNationalityFlag.length > 0) {
      console.log('Sample by flag:', byNationalityFlag.slice(0, 3).map(p => p.name));
    }
    if (byNationalityText.length > 0) {
      console.log('Sample by text:', byNationalityText.slice(0, 3).map(p => p.name));
    }
    if (byCountry.length > 0) {
      console.log('Sample by country:', byCountry.slice(0, 3).map(p => p.name));
    }
    if (byScope.length > 0) {
      console.log('Sample by scope:', byScope.slice(0, 3).map(p => p.name));
    }
    
  } catch (error) {
    console.error('Debug failed:', error);
  }
}

debugBrazilianProspects();
