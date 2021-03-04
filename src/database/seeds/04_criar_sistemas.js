const knex = require('knex')

module.exports = {
  async seed(knex) {
    await knex('system').insert([
      { label: 'GPS', value: 'GPS' },
      { label: 'Siebel15', value: 'Siebel' },
      { label: 'WDE', value: 'ContactCenter' },
      { label: 'Vivo360', value: 'Vivo360' },
      { label: 'VivoNext', value: 'VivoNext' },
      { label: 'SCA Cadastro', value: 'SCA Cadastro' },
      { label: 'Platon', value: 'Platon' },
      { label: 'Atlys', value: 'Atlys' },
      { label: 'COL', value: 'COL' },
      { label: 'Gsim', value: 'Gsim' },
      { label: '360º', value: '360º' },
      { label: 'Ngin', value: 'Ngin' },
      { label: 'Sics', value: 'Sics' },
      { label: 'SPN', value: 'SPN' },
      { label: 'SRE', value: 'SRE' },
      { label: 'Vivonet', value: 'Vivonet' },
      { label: 'Gedoc', value: 'Gedoc' },
      { label: 'SMAP', value: 'SMAP' },
      { label: 'Mariner* ', value: 'Mariner' },
      { label: 'Acs', value: 'Acs' },
      { label: 'Siebel 5', value: 'Siebel5' },
      { label: 'Viscon', value: 'Viscon' },
      { label: 'Cyber', value: 'Cyber' },
      { label: 'Kenan', value: 'Kenan' },
      { label: 'Talc', value: 'Talc' },
      { label: 'Sigres', value: 'Sigres' },
      { label: 'Conector', value: 'Conector' },
      { label: 'Thinkcat', value: 'Thinkcat' },
      { label: 'Scai', value: 'Scai' },
      { label: 'Nsi@', value: 'Nsi@' },
      { label: 'Atis', value: 'Atis' },
      { label: 'CSO', value: 'CSO' },
      { label: 'Sprinklr', value: 'Sprinklr' }
    ])
  }
}
