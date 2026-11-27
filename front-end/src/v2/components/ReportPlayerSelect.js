import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';

const ReportPlayerSelect = ({ id, label, options, value, onChange, disabled }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState(null);
    const [activeId, setActiveId] = useState(null);
    const inputRef = useRef(null);
    const activeRef = useRef(null);
    const selected = options.find(option => option.id === value);
    const search = (query || '').trim().toLowerCase();
    const filtered = options.filter(option => option.name.toLowerCase().includes(search));
    const available = filtered.filter(option => !option.disabled);
    const active = available.find(option => option.id === activeId);
    const listId = `${id}-options`;

    useEffect(() => {
        if (open) activeRef.current?.scrollIntoView?.({ block: 'nearest' });
    }, [open, activeId]);

    const close = () => {
        setOpen(false);
        setQuery(null);
        setActiveId(null);
    };

    const openMenu = () => {
        if (!open) {
            setActiveId(selected?.id ?? null);
            setOpen(true);
        }
    };

    const choose = option => {
        if (!option || option.disabled) return;
        onChange(option.id);
        close();
    };

    const handleKeyDown = e => {
        if (e.nativeEvent.isComposing) return;
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setOpen(true);
            if (!available.length) return;
            const index = open ? available.findIndex(option => option.id === activeId) : -1;
            const next = e.key === 'ArrowDown' ? (index + 1) % available.length
                : (index < 0 ? available.length - 1 : (index - 1 + available.length) % available.length);
            setActiveId(available[next]?.id ?? null);
        } else if (e.key === 'Enter' && open) {
            e.preventDefault();
            choose(active);
        } else if (e.key === 'Escape' && open) {
            e.preventDefault();
            close();
        }
    };

    return (
        <div className="report-player-search" onBlur={e => {
            if (!e.currentTarget.contains(e.relatedTarget)) close();
        }}>
            <Search className="report-player-search-icon" size={16} aria-hidden="true" />
            <input
                ref={inputRef}
                id={id}
                role="combobox"
                type="text"
                aria-label={label}
                aria-autocomplete="list"
                aria-expanded={open && !disabled}
                aria-controls={open && !disabled ? listId : undefined}
                aria-activedescendant={open && active ? `${id}-option-${active.id}` : undefined}
                autoComplete="off"
                spellCheck={false}
                placeholder="Search players"
                value={query ?? selected?.name ?? ''}
                disabled={disabled}
                onFocus={e => { openMenu(); e.currentTarget.select(); }}
                onClick={e => { openMenu(); if (query === null) e.currentTarget.select(); }}
                onChange={e => {
                    const text = e.target.value;
                    const search = text.trim().toLowerCase();
                    setQuery(text);
                    setActiveId(search ? options.find(option => !option.disabled && option.name.toLowerCase().includes(search))?.id ?? null : null);
                    setOpen(true);
                    onChange('');
                }}
                onKeyDown={handleKeyDown}
            />
            {(value || query) && <button
                className="report-player-clear"
                type="button"
                aria-label={`Clear ${label.toLowerCase()}`}
                title="Clear player"
                disabled={disabled}
                onClick={() => {
                    inputRef.current.focus();
                    onChange('');
                    setQuery('');
                    setActiveId(null);
                    setOpen(true);
                }}
            ><X size={15} aria-hidden="true" /></button>}
            <ChevronDown className="report-player-chevron" size={16} aria-hidden="true" />
            {open && !disabled && (
                <div className="report-player-options" id={listId} role="listbox" aria-label={`${label} players`}>
                    {filtered.map(option => (
                        <button
                            ref={option.id === active?.id ? activeRef : null}
                            key={option.id}
                            id={`${id}-option-${option.id}`}
                            type="button"
                            role="option"
                            tabIndex={-1}
                            aria-selected={option.id === value}
                            aria-disabled={option.disabled}
                            className={option.id === active?.id ? 'is-active' : ''}
                            onMouseDown={e => e.preventDefault()}
                            onMouseEnter={() => { if (!option.disabled) setActiveId(option.id); }}
                            onClick={() => choose(option)}
                        >
                            <span>{option.name}</span>
                            {option.disabled ? <small>Already selected</small> : option.id === value && <Check size={15} aria-hidden="true" />}
                        </button>
                    ))}
                    {!filtered.length && <p role="status">No players found.</p>}
                </div>
            )}
        </div>
    );
};

export default ReportPlayerSelect;
