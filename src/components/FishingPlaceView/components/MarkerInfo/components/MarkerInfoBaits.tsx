import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Bait } from '../../../../../shared/types/game';
import { useAppStateValue } from '../../../../../state/AppStateProvider';
import BaitsGrid from './BaitsGrid';
import './MarkerInfoBaits.css';

interface MarkerInfoBaitsProps {
  baits: string[];
  isEditable: boolean;
  onChange: (baits: string[]) => void;
}

const MarkerInfoBaits: React.FC<MarkerInfoBaitsProps> = (props) => {
  const [{ baits }] = useAppStateValue();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedBaits, setSelectedBaits] = useState<Bait[]>([]);

  useEffect(() => {
    const newValue = props.baits.reduce((acc, id) => {
      const found = baits.find((b) => b.id === id);
      if (found) {
        acc.push(found);
      }
      return acc;
    }, [] as Bait[]);
    setSelectedBaits(newValue);
  }, [baits, props.baits]);

  const handleAdd = (bait: Bait) => {
    setDialogOpen(false);
    const newValue = [...selectedBaits, bait];
    props.onChange(newValue.map((b) => b.id));
  };

  const handleRemove = (bait: Bait) => {
    const newValue = selectedBaits.filter((b) => b.id !== bait.id);
    props.onChange(newValue.map((b) => b.id));
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div className="marker-info-baits-wrapper">
      <h2 className="group-header">Наживки</h2>
      <div className="baits-container">
        <BaitsGrid
          baits={selectedBaits}
          removable={props.isEditable}
          onRemove={handleRemove}
          addOption={props.isEditable}
          onAddClick={handleOpenDialog}
        ></BaitsGrid>

        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          scroll="paper"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          transitionDuration={{ enter: 200, exit: 0 }}
        >
          <DialogTitle id="scroll-dialog-title">Выбор наживки</DialogTitle>

          <DialogContent dividers={true}>
            {['peps'].map(() => {
              const availableBaits = baits.filter((b) => !props.baits.includes(b.id));
              const types = Array.from(new Set(availableBaits.map((b) => b.type))).filter((type) => !!type);

              return types.map((type) => {
                return (
                  <div key={type}>
                    <h3 className="bait-type-name">{type}</h3>

                    <BaitsGrid
                      baits={baits.filter((b) => !props.baits.includes(b.id)).filter((b) => b.type === type)}
                      selectable={true}
                      onSelect={handleAdd}
                    ></BaitsGrid>
                  </div>
                );
              });
            })}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MarkerInfoBaits;
