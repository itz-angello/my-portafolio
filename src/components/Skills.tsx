import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Code2, Sparkles, Wrench } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { content, Skill, SkillCategory } from '../content';

type Filter = 'all' | SkillCategory;

export const Skills: React.FC = () => {
  const { lang, t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Skill | null>(null);
  const skills = content.skills.filter((skill) => filter === 'all' || skill.group === filter);
  const categoryLabels = t.skills.categories;
  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: t.skills.filterAll },
    { id: 'languages', label: categoryLabels.languages },
    { id: 'tools', label: categoryLabels.tools },
    { id: 'craft', label: categoryLabels.craft },
  ];

  const groupIcon = (group: SkillCategory) => {
    if (group === 'languages') return <Code2 size={17} aria-hidden="true" />;
    if (group === 'tools') return <Wrench size={17} aria-hidden="true" />;
    return <Sparkles size={17} aria-hidden="true" />;
  };

  return (
    <section id="skills" className="workshop-section" aria-labelledby="workshop-title">
      <div className="workshop-header">
        <span className="workshop-stamp"><Wrench size={14} aria-hidden="true" />{t.skills.workshopTitle}</span>
        <h1 id="workshop-title">{t.skills.heading}</h1>
        <p>{t.skills.workshopDescription}</p>
      </div>

      <div className="workshop-controls" role="group" aria-label={t.skills.heading}>
        {filters.map((item) => (
          <button key={item.id} type="button" onClick={() => setFilter(item.id)} aria-pressed={filter === item.id} className={`workshop-filter ${filter === item.id ? 'is-active' : ''}`}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="workshop-board">
        <div className="workshop-board-rail" aria-hidden="true"><i /><i /><i /><span /></div>
        <div className="workshop-grid">
          {skills.map((skill, index) => (
            <motion.button
              key={skill.id}
              type="button"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }}
              transition={{ duration: 0.45, delay: reduceMotion ? 0 : (index % 6) * 0.055, ease: [0.2, 0.7, 0.2, 1] }}
              onClick={() => setSelected((current) => current?.id === skill.id ? null : skill)}
              aria-expanded={selected?.id === skill.id}
              className={`workshop-tool ${selected?.id === skill.id ? 'is-selected' : ''}`}
            >
              <span className="workshop-tool-number">{String(content.skills.indexOf(skill) + 1).padStart(2, '0')}</span>
              <span className="workshop-tool-icon">{groupIcon(skill.group)}</span>
              <span className="workshop-tool-name">{skill.name}</span>
              <span className="workshop-tool-category">{categoryLabels[skill.group]}</span>
              <span className="workshop-tool-note">{skill.note[lang]}</span>
              <span className="workshop-tool-slot" aria-hidden="true" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div key={selected.id} initial={reduceMotion ? false : { opacity: 0, height: 0, y: 10 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -8 }} transition={{ duration: 0.3 }} className="workshop-detail">
            <div>
              <span className="workshop-detail-category">{categoryLabels[selected.group]}</span>
              <h3>{selected.name}</h3>
            </div>
            <p>{selected.details[lang]}</p>
            <button type="button" onClick={() => setSelected(null)} className="workshop-close">{t.skills.closeDetail}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
