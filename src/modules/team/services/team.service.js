// Service for Team & Incentives structure and hierarchy
export const INITIAL_TEAM_METRICS = {
  teamLeaders: 4,
  executives: 2,
  networkVolume: '₹7,71,900',
  rawNetworkVolume: 771900,
  incentivesEarned: '₹11,955',
  rawIncentivesEarned: 11955,
};

export const INITIAL_ORG_DATA = {
  admin: {
    id: 'admin-cbsg',
    title: 'CBSG Finance Limited · Admin',
    subtitle: '15 customers · 3 branches',
  },
  leftColumn: [
    {
      id: 'lead-anil',
      name: 'Anil Mehta',
      role: 'Team Lead',
      code: 'TL - PUN - 01',
      branch: 'Pune',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      customers: 7,
      volume: '₹1,91,600',
      rawVolume: 191600,
      incentives: '₹4,685',
      rawIncentives: 4685,
      subordinates: [
        {
          id: 'exec-rahul',
          name: 'Rahul Verma',
          role: 'Executive Manager',
          code: 'EM - 1042',
          branch: 'Pune',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
          customers: 4,
          volume: '₹1,78,100',
          rawVolume: 178100,
          incentives: '₹1,050',
          rawIncentives: 1050,
          reportsTo: 'Anil Mehta',
        },
      ],
    },
    {
      id: 'lead-sneha',
      name: 'Sneha Iyer',
      role: 'Team Lead',
      code: 'EM - 1077',
      branch: 'Pune',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
      customers: 3,
      volume: '₹10,500',
      rawVolume: 10500,
      incentives: '₹500',
      rawIncentives: 500,
      subordinates: [],
    },
  ],
  rightColumn: [
    {
      id: 'lead-meera',
      name: 'Meera Joshi',
      role: 'Team Lead',
      code: 'TL - MUM - 02',
      branch: 'Mumbai',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
      customers: 0,
      volume: '₹0',
      rawVolume: 0,
      incentives: '₹200',
      rawIncentives: 200,
      subordinates: [],
    },
    {
      id: 'lead-kavya',
      name: 'Kavya Nair',
      role: 'Team Lead',
      code: 'EM - 1093',
      branch: 'Mumbai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      customers: 5,
      volume: '₹5,69,800',
      rawVolume: 569800,
      incentives: '₹400',
      rawIncentives: 400,
      subordinates: [
        {
          id: 'exec-vikram',
          name: 'Vikram Singh',
          role: 'Executive Manager',
          code: 'EM - 1081',
          branch: 'Nagpur',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
          customers: 2,
          volume: '₹53,800',
          rawVolume: 53800,
          incentives: '₹5,120',
          rawIncentives: 5120,
          reportsTo: 'Kavya Nair',
        },
      ],
    },
  ],
};

export const teamService = {
  getOrgData: () => JSON.parse(JSON.stringify(INITIAL_ORG_DATA)),
  getMetrics: () => ({ ...INITIAL_TEAM_METRICS }),

  // Recalculate metrics from current org data
  calculateMetrics: (orgData) => {
    let leadersCount = 0;
    let executivesCount = 0;
    let totalVolume = 0;
    let totalIncentives = 0;

    const scanCol = (col) => {
      col.forEach((lead) => {
        leadersCount++;
        totalVolume += lead.rawVolume || 0;
        totalIncentives += lead.rawIncentives || 0;
        if (lead.subordinates && lead.subordinates.length > 0) {
          lead.subordinates.forEach((sub) => {
            executivesCount++;
            totalIncentives += sub.rawIncentives || 0;
          });
        }
      });
    };

    scanCol(orgData.leftColumn);
    scanCol(orgData.rightColumn);

    return {
      teamLeaders: leadersCount,
      executives: executivesCount,
      networkVolume: `₹${totalVolume.toLocaleString('en-IN')}`,
      rawNetworkVolume: totalVolume,
      incentivesEarned: `₹${totalIncentives.toLocaleString('en-IN')}`,
      rawIncentivesEarned: totalIncentives,
    };
  },

  getAllMembersFlat: (orgData = INITIAL_ORG_DATA) => {
    const list = [];
    const traverse = (col) => {
      col.forEach((lead) => {
        list.push({
          id: lead.id,
          name: lead.name,
          role: lead.role,
          code: lead.code,
          branch: lead.branch,
          avatar: lead.avatar,
          customers: lead.customers,
          volume: lead.volume,
          rawVolume: lead.rawVolume,
          incentives: lead.incentives,
          rawIncentives: lead.rawIncentives,
          reportsTo: 'CBSG Admin',
          status: 'Active',
        });
        if (lead.subordinates && lead.subordinates.length > 0) {
          lead.subordinates.forEach((sub) => {
            list.push({
              id: sub.id,
              name: sub.name,
              role: sub.role,
              code: sub.code,
              branch: sub.branch,
              avatar: sub.avatar,
              customers: sub.customers,
              volume: sub.volume,
              rawVolume: sub.rawVolume,
              incentives: sub.incentives,
              rawIncentives: sub.rawIncentives,
              reportsTo: lead.name,
              status: 'Active',
            });
          });
        }
      });
    };
    traverse(orgData.leftColumn);
    traverse(orgData.rightColumn);
    return list;
  },

  // 1. Move Executive Manager from one Team Lead to another
  moveExecutiveToLead: (orgData, execId, targetLeadId) => {
    const next = JSON.parse(JSON.stringify(orgData));
    let movedExec = null;
    let targetLead = null;

    // Find and remove from existing lead
    const checkColumns = (colName) => {
      next[colName].forEach((lead) => {
        if (lead.subordinates) {
          const idx = lead.subordinates.findIndex((s) => s.id === execId);
          if (idx !== -1) {
            movedExec = lead.subordinates.splice(idx, 1)[0];
          }
        }
        if (lead.id === targetLeadId) {
          targetLead = lead;
        }
      });
    };

    checkColumns('leftColumn');
    checkColumns('rightColumn');

    if (movedExec && targetLead) {
      movedExec.reportsTo = targetLead.name;
      if (!targetLead.subordinates) targetLead.subordinates = [];
      targetLead.subordinates.push(movedExec);
      return { success: true, orgData: next, member: movedExec, target: targetLead };
    }
    return { success: false, orgData };
  },

  // 2. Promote Executive Manager to Team Lead ("manager to team lead")
  promoteExecutiveToLead: (orgData, execId, targetColumn = 'rightColumn') => {
    const next = JSON.parse(JSON.stringify(orgData));
    let movedExec = null;

    const checkAndRemove = (colName) => {
      next[colName].forEach((lead) => {
        if (lead.subordinates) {
          const idx = lead.subordinates.findIndex((s) => s.id === execId);
          if (idx !== -1) {
            movedExec = lead.subordinates.splice(idx, 1)[0];
          }
        }
      });
    };

    checkAndRemove('leftColumn');
    checkAndRemove('rightColumn');

    if (movedExec) {
      const newLead = {
        ...movedExec,
        id: `lead-${movedExec.id}`,
        role: 'Team Lead',
        code: `TL - ${movedExec.branch.slice(0, 3).toUpperCase()} - 0${Math.floor(1 + Math.random() * 9)}`,
        subordinates: [],
        reportsTo: 'CBSG Admin',
      };
      next[targetColumn].push(newLead);
      return { success: true, orgData: next, member: newLead };
    }
    return { success: false, orgData };
  },

  // 3. Move/Demote Team Lead to become Executive Manager under another Team Lead ("team lead to manager")
  demoteLeadToExecutive: (orgData, sourceLeadId, targetLeadId) => {
    if (sourceLeadId === targetLeadId) return { success: false, orgData };
    const next = JSON.parse(JSON.stringify(orgData));
    let sourceLead = null;
    let targetLead = null;

    const findAndRemoveLead = (colName) => {
      const idx = next[colName].findIndex((l) => l.id === sourceLeadId);
      if (idx !== -1) {
        sourceLead = next[colName].splice(idx, 1)[0];
      }
      next[colName].forEach((l) => {
        if (l.id === targetLeadId) {
          targetLead = l;
        }
      });
    };

    findAndRemoveLead('leftColumn');
    findAndRemoveLead('rightColumn');

    if (sourceLead && targetLead) {
      const execObj = {
        id: `exec-${sourceLead.id}`,
        name: sourceLead.name,
        role: 'Executive Manager',
        code: `EM - ${Math.floor(1000 + Math.random() * 9000)}`,
        branch: sourceLead.branch,
        avatar: sourceLead.avatar,
        customers: sourceLead.customers,
        volume: sourceLead.volume,
        rawVolume: sourceLead.rawVolume,
        incentives: sourceLead.incentives,
        rawIncentives: sourceLead.rawIncentives,
        reportsTo: targetLead.name,
      };

      if (!targetLead.subordinates) targetLead.subordinates = [];
      targetLead.subordinates.push(execObj);

      // If sourceLead had subordinates, transfer them under targetLead or Admin
      if (sourceLead.subordinates && sourceLead.subordinates.length > 0) {
        sourceLead.subordinates.forEach((sub) => {
          sub.reportsTo = targetLead.name;
          targetLead.subordinates.push(sub);
        });
      }

      return { success: true, orgData: next, member: execObj, target: targetLead };
    }
    return { success: false, orgData };
  },

  // 4. Move/Reorder Team Lead to another column or position ("one team lead to another")
  reorderTeamLead: (orgData, leadId, targetColumn, targetIndex) => {
    const next = JSON.parse(JSON.stringify(orgData));
    let movedLead = null;

    const removeLead = (colName) => {
      const idx = next[colName].findIndex((l) => l.id === leadId);
      if (idx !== -1) {
        movedLead = next[colName].splice(idx, 1)[0];
      }
    };

    removeLead('leftColumn');
    removeLead('rightColumn');

    if (movedLead) {
      if (targetIndex >= 0 && targetIndex <= next[targetColumn].length) {
        next[targetColumn].splice(targetIndex, 0, movedLead);
      } else {
        next[targetColumn].push(movedLead);
      }
      return { success: true, orgData: next, member: movedLead };
    }
    return { success: false, orgData };
  },

  // 5. Swap two Team Leads' positions
  swapTeamLeads: (orgData, leadId1, leadId2) => {
    if (leadId1 === leadId2) return { success: false, orgData };
    const next = JSON.parse(JSON.stringify(orgData));
    let pos1 = null;
    let pos2 = null;

    ['leftColumn', 'rightColumn'].forEach((col) => {
      next[col].forEach((l, idx) => {
        if (l.id === leadId1) pos1 = { col, idx, lead: l };
        if (l.id === leadId2) pos2 = { col, idx, lead: l };
      });
    });

    if (pos1 && pos2) {
      next[pos1.col][pos1.idx] = pos2.lead;
      next[pos2.col][pos2.idx] = pos1.lead;
      return { success: true, orgData: next };
    }
    return { success: false, orgData };
  },
};
